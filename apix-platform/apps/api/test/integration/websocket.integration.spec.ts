import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/services/prisma.service';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('WebSocket Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authService: AuthService;
  let accessToken: string;
  let organizationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    
    await app.init();
    await app.listen(3001);

    // Create test user and get token
    const authResult = await authService.register({
      email: 'test@example.com',
      password: 'password123',
      organizationName: 'Test Org',
      organizationSlug: 'test-org',
    });

    accessToken = authResult.accessToken;
    organizationId = authResult.organization.id;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up connections
    await prismaService.apiXConnection.deleteMany({});
  });

  describe('WebSocket Connection', () => {
    let client: Socket;

    afterEach(() => {
      if (client) {
        client.disconnect();
      }
    });

    it('should connect with valid token', (done) => {
      client = io('http://localhost:3001', {
        auth: {
          token: accessToken,
        },
        transports: ['websocket'],
      });

      client.on('connected', (data) => {
        expect(data).toHaveProperty('sessionId');
        expect(data).toHaveProperty('userId');
        expect(data.organizationId).toBe(organizationId);
        done();
      });

      client.on('error', (error) => {
        done(error);
      });
    });

    it('should reject connection without token', (done) => {
      client = io('http://localhost:3001', {
        transports: ['websocket'],
      });

      client.on('error', (error) => {
        expect(error.message).toContain('Authentication required');
        done();
      });

      client.on('connected', () => {
        done(new Error('Should not connect without token'));
      });
    });

    it('should reject connection with invalid token', (done) => {
      client = io('http://localhost:3001', {
        auth: {
          token: 'invalid-token',
        },
        transports: ['websocket'],
      });

      client.on('error', (error) => {
        expect(error.message).toContain('Invalid token');
        done();
      });

      client.on('connected', () => {
        done(new Error('Should not connect with invalid token'));
      });
    });
  });

  describe('Channel Subscription', () => {
    let client: Socket;

    beforeEach((done) => {
      client = io('http://localhost:3001', {
        auth: {
          token: accessToken,
        },
        transports: ['websocket'],
      });

      client.on('connected', () => {
        done();
      });
    });

    afterEach(() => {
      if (client) {
        client.disconnect();
      }
    });

    it('should subscribe to channels', (done) => {
      const subscriptionRequest = {
        channels: ['test-channel', 'another-channel'],
        acknowledgment: true,
      };

      client.emit('subscribe', subscriptionRequest);

      client.on('subscribed', (data) => {
        expect(data.channels).toEqual(subscriptionRequest.channels);
        expect(data).toHaveProperty('timestamp');
        done();
      });

      client.on('error', (error) => {
        done(error);
      });
    });

    it('should unsubscribe from channels', (done) => {
      const channels = ['test-channel'];

      // First subscribe
      client.emit('subscribe', { channels });

      client.on('subscribed', () => {
        // Then unsubscribe
        client.emit('unsubscribe', { channels });
      });

      client.on('unsubscribed', (data) => {
        expect(data.channels).toEqual(channels);
        done();
      });

      client.on('error', (error) => {
        done(error);
      });
    });
  });

  describe('Message Publishing', () => {
    let client: Socket;

    beforeEach((done) => {
      client = io('http://localhost:3001', {
        auth: {
          token: accessToken,
        },
        transports: ['websocket'],
      });

      client.on('connected', () => {
        done();
      });
    });

    afterEach(() => {
      if (client) {
        client.disconnect();
      }
    });

    it('should publish messages to channels', (done) => {
      const message = {
        type: 'test_event',
        channel: 'test-channel',
        payload: {
          message: 'Hello, World!',
          timestamp: Date.now(),
        },
      };

      client.emit('publish', message);

      client.on('published', (data) => {
        expect(data).toHaveProperty('messageId');
        expect(data.channel).toBe(message.channel);
        done();
      });

      client.on('error', (error) => {
        done(error);
      });
    });

    it('should reject publishing to unauthorized channels', (done) => {
      const message = {
        type: 'test_event',
        channel: 'unauthorized-channel',
        payload: { test: true },
      };

      client.emit('publish', message);

      client.on('error', (error) => {
        expect(error.message).toContain('unauthorized');
        done();
      });

      client.on('published', () => {
        done(new Error('Should not publish to unauthorized channel'));
      });
    });
  });

  describe('Heartbeat', () => {
    let client: Socket;

    beforeEach((done) => {
      client = io('http://localhost:3001', {
        auth: {
          token: accessToken,
        },
        transports: ['websocket'],
      });

      client.on('connected', () => {
        done();
      });
    });

    afterEach(() => {
      if (client) {
        client.disconnect();
      }
    });

    it('should respond to ping with pong', (done) => {
      client.emit('ping');

      client.on('pong', (data) => {
        expect(data).toHaveProperty('timestamp');
        done();
      });
    });

    it('should receive periodic heartbeat', (done) => {
      client.on('heartbeat', (data) => {
        expect(data).toHaveProperty('timestamp');
        done();
      });
    });
  });

  describe('Multi-Client Communication', () => {
    let client1: Socket;
    let client2: Socket;

    beforeEach((done) => {
      let connectedCount = 0;

      const onConnected = () => {
        connectedCount++;
        if (connectedCount === 2) {
          done();
        }
      };

      client1 = io('http://localhost:3001', {
        auth: { token: accessToken },
        transports: ['websocket'],
      });

      client2 = io('http://localhost:3001', {
        auth: { token: accessToken },
        transports: ['websocket'],
      });

      client1.on('connected', onConnected);
      client2.on('connected', onConnected);
    });

    afterEach(() => {
      if (client1) client1.disconnect();
      if (client2) client2.disconnect();
    });

    it('should broadcast messages between clients', (done) => {
      const testChannel = 'broadcast-test';
      const testMessage = {
        type: 'broadcast_test',
        channel: testChannel,
        payload: { message: 'Broadcast test' },
      };

      // Client 2 subscribes to channel
      client2.emit('subscribe', { channels: [testChannel] });

      client2.on('subscribed', () => {
        // Client 1 publishes message
        client1.emit('publish', testMessage);
      });

      // Client 2 should receive the event
      client2.on('event', (data) => {
        expect(data.type).toBe(testMessage.type);
        expect(data.payload.message).toBe(testMessage.payload.message);
        done();
      });
    });
  });
});
