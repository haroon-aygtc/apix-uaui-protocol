### WebSocket
- **URL**: ws://localhost:3001 (Socket.IO)
- Auth via handshake: pass `Authorization: Bearer <token>` header or `?token=<token>` query.

### Events (client → server)
- subscribe: { channels: string[], filters?: object, acknowledgment?: boolean }
- unsubscribe: { channels: string[] }
- publish: { type: string, channel: string, payload: any, metadata?: { timestamp:number, version:string, correlationId?:string } }
- ping: {}

### Events (server → client)
- connected: { sessionId, userId, organizationId, timestamp }
- subscribed: { channels, timestamp }
- unsubscribed: { channels, timestamp }
- published: { messageId, channel, timestamp }
- event: any (broadcast)
- heartbeat: { timestamp }
- error: { message, code? }
- pong: { timestamp }

### Example (browser, socket.io-client)
```ts
import { io } from 'socket.io-client';

const token = localStorage.getItem('apix-token');
const socket = io('ws://localhost:3001', {
  transports: ['websocket'],
  extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
});

socket.on('connected', (info) => console.log('connected', info));
socket.on('event', (msg) => console.log('event', msg));
socket.on('error', (e) => console.error('ws error', e));

socket.emit('subscribe', { channels: ['agent_events'], filters: { eventTypes: ['agent_started'] } });

socket.emit('publish', {
  type: 'agent_started',
  channel: 'agent_events',
  payload: { agentId: 'agent_123', timestamp: new Date().toISOString() },
  metadata: { timestamp: Date.now(), version: '1.0.0' },
});

socket.emit('ping');
```

### Rooms and scoping
- Organization room: `org:<organizationId>`
- Channel room: `channel:<organizationId>:<channel>`

### Server helpers
- broadcastToChannel(channel, organizationId, message)
- broadcastToOrganization(organizationId, message)