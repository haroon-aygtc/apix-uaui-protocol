// APIX Protocol Types based on the implementation plan

export interface ApiXConnection {
  id: string;
  organizationId: string;
  userId?: string;
  sessionId: string;
  clientType: ClientType;
  channels: string[];
  metadata: Record<string, any>;
  connectedAt: string;
  lastHeartbeat: string;
  status: ConnectionStatus;
}

export interface ApiXEvent {
  id: string;
  eventType: string;
  channel: string;
  payload: any;
  sessionId?: string;
  acknowledgment: boolean;
  retryCount: number;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ApiXChannel {
  id: string;
  name: string;
  type: ChannelType;
  organizationId?: string;
  permissions: Record<string, any>;
  subscribers: number;
  createdAt: string;
}

export enum ClientType {
  WEB_APP = 'WEB_APP',
  MOBILE_APP = 'MOBILE_APP',
  SDK_WIDGET = 'SDK_WIDGET',
  API_CLIENT = 'API_CLIENT',
  INTERNAL_SERVICE = 'INTERNAL_SERVICE',
}

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  SUSPENDED = 'SUSPENDED',
}

export enum ChannelType {
  AGENT_EVENTS = 'AGENT_EVENTS',
  TOOL_EVENTS = 'TOOL_EVENTS',
  WORKFLOW_EVENTS = 'WORKFLOW_EVENTS',
  PROVIDER_EVENTS = 'PROVIDER_EVENTS',
  SYSTEM_EVENTS = 'SYSTEM_EVENTS',
  PRIVATE_USER = 'PRIVATE_USER',
  ORGANIZATION = 'ORGANIZATION',
}

// API Response Types
export interface HealthResponse {
  message: string;
  timestamp: string;
  version: string;
}

export interface StatusResponse {
  service: string;
  version: string;
  environment: string;
  timestamp: string;
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  components: {
    websocket: string;
    redis: string;
    database: string;
    eventRouter: string;
    messageQueue: string;
  };
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: string;
  channel: string;
  payload: any;
  metadata?: {
    timestamp: number;
    version: string;
    correlation_id?: string;
  };
}

export interface SubscriptionRequest {
  channels: string[];
  filters?: Record<string, any>;
  acknowledgment?: boolean;
}

// Testing Types
export interface TestCase {
  id: string;
  name: string;
  description: string;
  type: 'api' | 'websocket' | 'performance';
  endpoint?: string;
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  expectedStatus?: number;
  expectedResponse?: any;
  timeout?: number;
  retries?: number;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  startTime: string;
  endTime?: string;
  duration?: number;
  response?: any;
  error?: string;
  metrics?: {
    responseTime: number;
    statusCode: number;
    size: number;
  };
}

export interface PerformanceMetrics {
  timestamp: string;
  responseTime: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
  memoryUsage: number;
  cpuUsage: number;
}
