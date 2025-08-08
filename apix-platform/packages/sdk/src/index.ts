import axios, { AxiosInstance } from 'axios';
import { io, Socket } from 'socket.io-client';

export type SynapseAIClientOptions = {
  baseUrl: string; // e.g., http://localhost:3001/api/v1
  apiKey?: string;
  tenantId?: string;
  websocketUrl?: string; // e.g., ws://localhost:3001
  token?: string; // JWT for user-specific contexts
};

export type StreamHandler = (event: any) => void;

export class SynapseAI {
  private http: AxiosInstance;
  private socket?: Socket;
  private options: SynapseAIClientOptions;

  constructor(options: SynapseAIClientOptions) {
    this.options = options;
    this.http = axios.create({
      baseURL: options.baseUrl,
      headers: options.apiKey ? { Authorization: `Bearer ${options.apiKey}` } : undefined,
    });
  }

  async invokeAgent(agentId: string, input: any) {
    const res = await this.http.post(`/agents/${agentId}/invoke`, { input, tenantId: this.options.tenantId });
    return res.data;
  }

  async executeTool(toolId: string, input: any) {
    const res = await this.http.post(`/tools/${toolId}/execute`, { input, tenantId: this.options.tenantId });
    return res.data;
  }

  connect(options?: { token?: string }) {
    if (this.socket) return this.socket;
    const url = this.options.websocketUrl || this.options.baseUrl.replace(/\/api\/v1$/, '');
    this.socket = io(url, {
      transports: ['websocket'],
      auth: { token: options?.token || this.options.token },
    });
    return this.socket;
  }

  async subscribe(channels: string[], handler: StreamHandler) {
    if (!this.socket) this.connect();
    this.socket!.on('event', handler);
    this.socket!.emit('subscribe', { channels });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = undefined;
    }
  }
}