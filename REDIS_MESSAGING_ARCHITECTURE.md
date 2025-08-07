# 🚀 Redis Messaging Architecture - Streams vs Pub/Sub

## 📋 **Current Implementation: Hybrid Approach (RECOMMENDED)**

We're using **both** Redis Streams with Consumer Groups **and** Redis Pub/Sub for different use cases. This is the **optimal architecture** for a production APIX system.

---

## 🏗️ **Architecture Decision**

### **✅ Redis Streams + Consumer Groups**
**Use for: Persistent, reliable, ordered messaging**

#### **When to Use:**
- ✅ **Event Processing**: Background jobs, workflows, integrations
- ✅ **Audit Logs**: Compliance, security, debugging
- ✅ **Data Synchronization**: Cross-service communication
- ✅ **Guaranteed Delivery**: Critical business events
- ✅ **Load Balancing**: Multiple worker instances

#### **Benefits:**
- **Persistence**: Messages survive restarts
- **Ordering**: Guaranteed message order
- **Consumer Groups**: Load balancing across workers
- **Acknowledgment**: Reliable delivery confirmation
- **Replay**: Can reprocess from any point
- **Fault Tolerance**: Automatic failover

### **✅ Redis Pub/Sub**
**Use for: Real-time, immediate notifications**

#### **When to Use:**
- ✅ **WebSocket Broadcasts**: Live updates to connected clients
- ✅ **Real-time Notifications**: Instant user alerts
- ✅ **Status Updates**: Connection state, presence
- ✅ **Live Dashboards**: Real-time metrics
- ✅ **System Alerts**: Immediate notifications

#### **Benefits:**
- **Low Latency**: Immediate delivery
- **Simple**: Easy to implement
- **Broadcast**: One-to-many messaging
- **Memory Efficient**: No persistence overhead

---

## 🎯 **Usage Patterns**

### **Pattern 1: Persistent Event Processing**
```typescript
// Add event to stream for reliable processing
const messageId = await messagingService.addEventToStream(context, 'user-actions', {
  eventType: 'user.created',
  payload: { userId: '123', email: 'user@example.com' },
  timestamp: new Date().toISOString(),
  organizationId: context.organizationId,
});

// Process events with consumer group (multiple workers can process)
const events = await messagingService.processEventsFromStream(
  context,
  'user-actions',
  'worker-1', // Consumer name
  10 // Batch size
);

// Acknowledge processed events
for (const event of events) {
  await processUserEvent(event);
  await messagingService.acknowledgeEvent(context, 'user-actions', event.messageId);
}
```

### **Pattern 2: Real-time Notifications**
```typescript
// Publish real-time notification
await messagingService.publishRealtimeMessage(context, 'notifications', {
  type: 'user.online',
  data: { userId: '123', status: 'online' },
  timestamp: new Date().toISOString(),
  organizationId: context.organizationId,
});

// Subscribe to real-time updates (WebSocket connections)
await messagingService.subscribeToRealtimeMessages(
  context,
  'notifications',
  (message) => {
    // Send to WebSocket clients immediately
    websocketGateway.broadcast(message);
  }
);
```

### **Pattern 3: Hybrid Events (Best of Both)**
```typescript
// Critical events that need both persistence AND real-time notification
await messagingService.publishHybridEvent(
  context,
  'payment.completed',
  { 
    paymentId: 'pay_123',
    amount: 99.99,
    currency: 'USD'
  },
  {
    persistToStream: true,    // For processing, webhooks, audit
    notifyRealtime: true,     // For immediate UI updates
    streamName: 'payments',
    realtimeChannel: 'user-notifications'
  }
);
```

---

## 🔧 **Implementation Examples**

### **APIX Event Processing (Streams)**
```typescript
// 1. User creates an APIX event
await messagingService.addEventToStream(context, 'apix-events', {
  eventType: 'apix.event.created',
  payload: {
    eventId: 'evt_123',
    channel: 'user-actions',
    data: { action: 'button_click' }
  },
  timestamp: new Date().toISOString(),
  organizationId: context.organizationId,
  userId: context.userId,
});

// 2. Background workers process events
const worker = async () => {
  while (true) {
    const events = await messagingService.processEventsFromStream(
      context,
      'apix-events',
      `worker-${process.pid}`,
      5
    );

    for (const event of events) {
      try {
        // Process event (webhooks, analytics, etc.)
        await processApixEvent(event);
        
        // Acknowledge successful processing
        await messagingService.acknowledgeEvent(
          context,
          'apix-events',
          event.messageId
        );
      } catch (error) {
        // Handle error (retry, dead letter queue, etc.)
        logger.error(`Failed to process event: ${error.message}`);
      }
    }
  }
};
```

### **Real-time WebSocket Updates (Pub/Sub)**
```typescript
// WebSocket Gateway
@WebSocketGateway()
export class ApixGateway {
  @SubscribeMessage('subscribe_updates')
  async handleSubscription(
    @ConnectedSocket() socket: TenantSocket,
    @MessageBody() data: { channels: string[] }
  ) {
    for (const channel of data.channels) {
      await this.messagingService.subscribeToRealtimeMessages(
        socket.tenantContext,
        channel,
        (message) => {
          // Send immediately to WebSocket client
          socket.emit('realtime_update', message);
        }
      );
    }
  }
}

// Publish real-time updates
await messagingService.publishRealtimeMessage(context, 'connection-status', {
  type: 'connection.status_changed',
  data: {
    connectionId: 'conn_123',
    status: 'connected',
    quality: 'excellent'
  },
  timestamp: new Date().toISOString(),
  organizationId: context.organizationId,
});
```

---

## 📊 **Performance Characteristics**

### **Redis Streams**
- **Throughput**: ~100K+ messages/second
- **Latency**: ~1-5ms (depending on persistence)
- **Memory**: ~1KB per message (with TTL)
- **Scalability**: Horizontal (multiple consumer groups)

### **Redis Pub/Sub**
- **Throughput**: ~1M+ messages/second
- **Latency**: <1ms
- **Memory**: No persistence (0 bytes after delivery)
- **Scalability**: Vertical (single publisher, multiple subscribers)

---

## 🎯 **Tenant Isolation**

Both patterns maintain **complete tenant isolation**:

```typescript
// Stream keys are tenant-prefixed
tenant:org-123:stream:events
tenant:org-456:stream:events

// Channel keys are tenant-prefixed  
tenant:org-123:channel:notifications
tenant:org-456:channel:notifications
```

---

## 🚀 **Recommendation: Keep Hybrid Approach**

**✅ CURRENT IMPLEMENTATION IS OPTIMAL**

The hybrid approach provides:
1. **Reliability** for critical events (Streams)
2. **Real-time performance** for live updates (Pub/Sub)
3. **Scalability** for high-throughput processing
4. **Flexibility** to choose the right tool for each use case

### **Migration Path (if needed):**
- **Phase 1**: Keep current hybrid approach ✅
- **Phase 2**: Add enhanced TenantMessagingService for clearer patterns
- **Phase 3**: Gradually migrate to pattern-based usage
- **Phase 4**: Add monitoring and observability

**No immediate changes needed - current architecture is production-ready!** 🎉
