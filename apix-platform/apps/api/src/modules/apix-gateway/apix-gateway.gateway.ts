import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';
import { EventStreamService } from '../../common/services/event-stream.service';
import { PrismaService } from '../../common/services/prisma.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  organizationId?: string;
  organizationSlug?: string;
  clientType?: string;
  sessionId?: string;
}

interface WebSocketMessage {
  type: string;
  channel?: string;
  payload?: any;
  metadata?: {
    timestamp: number;
    version: string;
    correlationId?: string;
  };
}

interface SubscriptionRequest {
  channels: string[];
  filters?: Record<string, any>;
  acknowledgment?: boolean;
}

@WebSocketGateway({
  cors: {
    origin: process.env.WS_CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket'],
})
export class ApixGatewayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ApixGatewayGateway.name);
  private connectedClients = new Map<string, AuthenticatedSocket>();

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private eventStreamService: EventStreamService,
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
    this.setupHeartbeat();
  }

  async handleConnection(client: AuthenticatedSocket) {
    try {
      this.logger.log(`Client attempting to connect: ${client.id}`);
      
      // Extract token from handshake
      const token = this.extractTokenFromHandshake(client);
      if (!token) {
        this.logger.warn(`No token provided for client: ${client.id}`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.verifyToken(token);
      if (!payload) {
        this.logger.warn(`Invalid token for client: ${client.id}`);
        client.emit('error', { message: 'Invalid token' });
        client.disconnect();
        return;
      }

      // Authenticate user
      const user = await this.authService.getUserById(payload.sub);
      if (!user || !user.isActive) {
        this.logger.warn(`User not found or inactive: ${payload.sub}`);
        client.emit('error', { message: 'User not found or inactive' });
        client.disconnect();
        return;
      }

      // Set client properties
      client.userId = user.id;
      client.organizationId = user.organizationId;
      client.organizationSlug = payload.organizationSlug;
      client.sessionId = this.generateSessionId();

      // Store connection in database
      await this.createConnection(client);

      // Add to connected clients
      this.connectedClients.set(client.id, client);

      // Join organization room
      client.join(`org:${client.organizationId}`);

      // Send connection confirmation
      client.emit('connected', {
        sessionId: client.sessionId,
        userId: client.userId,
        organizationId: client.organizationId,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Client connected successfully: ${client.id} (User: ${client.userId})`);
    } catch (error) {
      this.logger.error(`Connection error for client ${client.id}:`, error);
      client.emit('error', { message: 'Connection failed' });
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    try {
      this.logger.log(`Client disconnecting: ${client.id}`);

      // Update connection status in database
      if (client.sessionId) {
        await this.updateConnectionStatus(client.sessionId, 'DISCONNECTED');
      }

      // Remove from connected clients
      this.connectedClients.delete(client.id);

      this.logger.log(`Client disconnected: ${client.id}`);
    } catch (error) {
      this.logger.error(`Disconnect error for client ${client.id}:`, error);
    }
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SubscriptionRequest,
  ) {
    try {
      if (!this.isAuthenticated(client)) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const { channels, filters, acknowledgment } = data;

      // Validate channels
      for (const channel of channels) {
        if (!this.isChannelAllowed(channel, client.organizationId)) {
          client.emit('error', { message: `Access denied to channel: ${channel}` });
          return;
        }
      }

      // Join channel rooms
      for (const channel of channels) {
        const roomName = this.getChannelRoom(channel, client.organizationId);
        client.join(roomName);
      }

      // Update connection channels in database
      await this.updateConnectionChannels(client.sessionId, channels);

      // Start consuming events for this client
      await this.startEventConsumption(client, { channels, filters, acknowledgment });

      client.emit('subscribed', {
        channels,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Client ${client.id} subscribed to channels: ${channels.join(', ')}`);
    } catch (error) {
      this.logger.error(`Subscribe error for client ${client.id}:`, error);
      client.emit('error', { message: 'Subscription failed' });
    }
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { channels: string[] },
  ) {
    try {
      if (!this.isAuthenticated(client)) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const { channels } = data;

      // Leave channel rooms
      for (const channel of channels) {
        const roomName = this.getChannelRoom(channel, client.organizationId);
        client.leave(roomName);
      }

      client.emit('unsubscribed', {
        channels,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Client ${client.id} unsubscribed from channels: ${channels.join(', ')}`);
    } catch (error) {
      this.logger.error(`Unsubscribe error for client ${client.id}:`, error);
      client.emit('error', { message: 'Unsubscribe failed' });
    }
  }

  @SubscribeMessage('publish')
  async handlePublish(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: WebSocketMessage,
  ) {
    try {
      if (!this.isAuthenticated(client)) {
        client.emit('error', { message: 'Not authenticated' });
        return;
      }

      const { type, channel, payload, metadata } = data;

      if (!channel || !this.isChannelAllowed(channel, client.organizationId)) {
        client.emit('error', { message: 'Invalid or unauthorized channel' });
        return;
      }

      // Publish event to stream
      const event = {
        eventType: type,
        channel,
        payload,
        organizationId: client.organizationId,
        userId: client.userId,
        acknowledgment: true,
        retryCount: 0,
        createdAt: new Date().toISOString(),
        metadata,
      };

      const messageId = await this.eventStreamService.publishEvent(event);

      client.emit('published', {
        messageId,
        channel,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Client ${client.id} published to channel ${channel}: ${messageId}`);
    } catch (error) {
      this.logger.error(`Publish error for client ${client.id}:`, error);
      client.emit('error', { message: 'Publish failed' });
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: AuthenticatedSocket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
    this.updateHeartbeat(client);
  }

  // Private helper methods
  private extractTokenFromHandshake(client: Socket): string | null {
    const token = client.handshake.auth?.token || 
                 client.handshake.headers?.authorization?.replace('Bearer ', '');
    return token || null;
  }

  private async verifyToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      return null;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isAuthenticated(client: AuthenticatedSocket): boolean {
    return !!(client.userId && client.organizationId);
  }

  private isChannelAllowed(channel: string, organizationId: string): boolean {
    // Implement channel permission logic here
    // For now, allow all channels for authenticated users
    return true;
  }

  private getChannelRoom(channel: string, organizationId: string): string {
    return `channel:${organizationId}:${channel}`;
  }

  private async createConnection(client: AuthenticatedSocket) {
    await this.prismaService.apiXConnection.create({
      data: {
        sessionId: client.sessionId,
        clientType: 'WEB_APP', // Default, can be extracted from handshake
        status: 'CONNECTED',
        channels: [],
        metadata: {
          userAgent: client.handshake.headers['user-agent'],
          ip: client.handshake.address,
        },
        organizationId: client.organizationId,
        userId: client.userId,
      },
    });
  }

  private async updateConnectionStatus(sessionId: string, status: string) {
    await this.prismaService.apiXConnection.update({
      where: { sessionId },
      data: { 
        status: status as any,
        disconnectedAt: status === 'DISCONNECTED' ? new Date() : undefined,
      },
    });
  }

  private async updateConnectionChannels(sessionId: string, channels: string[]) {
    await this.prismaService.apiXConnection.update({
      where: { sessionId },
      data: { channels },
    });
  }

  private async updateHeartbeat(client: AuthenticatedSocket) {
    if (client.sessionId) {
      await this.prismaService.apiXConnection.update({
        where: { sessionId: client.sessionId },
        data: { lastHeartbeat: new Date() },
      });
    }
  }

  private async startEventConsumption(client: AuthenticatedSocket, subscription: any) {
    // This would start consuming events from Redis streams
    // and forward them to the client
    // Implementation depends on the specific event consumption strategy
  }

  private setupHeartbeat() {
    const interval = this.configService.get<number>('websocket.heartbeat.interval', 30000);
    
    setInterval(() => {
      this.server.emit('heartbeat', { timestamp: new Date().toISOString() });
    }, interval);
  }

  // Public methods for external use
  async broadcastToChannel(channel: string, organizationId: string, message: any) {
    const roomName = this.getChannelRoom(channel, organizationId);
    this.server.to(roomName).emit('event', message);
  }

  async broadcastToOrganization(organizationId: string, message: any) {
    this.server.to(`org:${organizationId}`).emit('event', message);
  }

  getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  getConnectedClientsByOrganization(organizationId: string): AuthenticatedSocket[] {
    return Array.from(this.connectedClients.values()).filter(
      client => client.organizationId === organizationId
    );
  }
}
