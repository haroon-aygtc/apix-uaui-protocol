import {
  ApixEventSchema,
  AgentEventSchema,
  ToolEventSchema,
  WorkflowEventSchema,
  SystemEventSchema,
  ConnectionEventSchema,
  ProviderEventSchema,
  WebSocketMessageSchema,
  SubscriptionRequestSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  validateApixEvent,
  validateWebSocketMessage,
  validateEventByType,
  validateAndTransformEvent,
  sanitizeEventPayload,
  createEventId,
  createSessionId,
  isValidEventType,
  getEventSchema,
  SCHEMA_REGISTRY,
  EVENT_TYPES,
  CLIENT_TYPES,
} from './apix-events.schema';

describe('APIX Event Schemas', () => {
  describe('Base ApixEventSchema', () => {
    it('should validate a valid APIX event', () => {
      const validEvent = {
        eventType: 'test_event',
        channel: 'test-channel',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString(),
      };

      const result = ApixEventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
    });

    it('should reject invalid event type format', () => {
      const invalidEvent = {
        eventType: 'invalid event type!',
        channel: 'test-channel',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString(),
      };

      const result = ApixEventSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
    });

    it('should reject invalid channel name format', () => {
      const invalidEvent = {
        eventType: 'test_event',
        channel: 'invalid channel!',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString(),
      };

      const result = ApixEventSchema.safeParse(invalidEvent);
      expect(result.success).toBe(false);
    });

    it('should set default values correctly', () => {
      const event = {
        eventType: 'test_event',
        channel: 'test-channel',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString(),
      };

      const result = ApixEventSchema.parse(event);
      expect(result.acknowledgment).toBe(false);
      expect(result.retryCount).toBe(0);
      expect(result.priority).toBe('NORMAL');
      expect(result.status).toBe('PENDING');
    });
  });

  describe('AgentEventSchema', () => {
    it('should validate a valid agent event', () => {
      const validAgentEvent = {
        eventType: 'agent_events',
        channel: 'agent-channel',
        payload: {
          agentId: '123e4567-e89b-12d3-a456-426614174000',
          agentName: 'TestAgent',
          action: 'start',
          status: 'running',
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      const result = AgentEventSchema.safeParse(validAgentEvent);
      expect(result.success).toBe(true);
    });

    it('should reject invalid agent action', () => {
      const invalidAgentEvent = {
        eventType: 'agent_events',
        channel: 'agent-channel',
        payload: {
          agentId: '123e4567-e89b-12d3-a456-426614174000',
          agentName: 'TestAgent',
          action: 'invalid_action',
          status: 'running',
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      const result = AgentEventSchema.safeParse(invalidAgentEvent);
      expect(result.success).toBe(false);
    });

    it('should validate resource usage when provided', () => {
      const agentEventWithResources = {
        eventType: 'agent_events',
        channel: 'agent-channel',
        payload: {
          agentId: '123e4567-e89b-12d3-a456-426614174000',
          agentName: 'TestAgent',
          action: 'status_update',
          status: 'running',
          timestamp: new Date().toISOString(),
          resourceUsage: {
            cpu: 75.5,
            memory: 1024000,
            network: 500,
          },
        },
        createdAt: new Date().toISOString(),
      };

      const result = AgentEventSchema.safeParse(agentEventWithResources);
      expect(result.success).toBe(true);
    });
  });

  describe('ToolEventSchema', () => {
    it('should validate a valid tool event', () => {
      const validToolEvent = {
        eventType: 'tool_events',
        channel: 'tool-channel',
        payload: {
          toolId: '123e4567-e89b-12d3-a456-426614174000',
          toolName: 'TestTool',
          action: 'call_start',
          timestamp: new Date().toISOString(),
          input: { param1: 'value1' },
        },
        createdAt: new Date().toISOString(),
      };

      const result = ToolEventSchema.safeParse(validToolEvent);
      expect(result.success).toBe(true);
    });

    it('should validate tool event with error', () => {
      const toolEventWithError = {
        eventType: 'tool_events',
        channel: 'tool-channel',
        payload: {
          toolId: '123e4567-e89b-12d3-a456-426614174000',
          toolName: 'TestTool',
          action: 'call_error',
          timestamp: new Date().toISOString(),
          error: {
            code: 'TOOL_ERROR',
            message: 'Tool execution failed',
            details: { reason: 'Invalid input' },
          },
        },
        createdAt: new Date().toISOString(),
      };

      const result = ToolEventSchema.safeParse(toolEventWithError);
      expect(result.success).toBe(true);
    });
  });

  describe('WorkflowEventSchema', () => {
    it('should validate a valid workflow event', () => {
      const validWorkflowEvent = {
        eventType: 'workflow_events',
        channel: 'workflow-channel',
        payload: {
          workflowId: '123e4567-e89b-12d3-a456-426614174000',
          workflowName: 'TestWorkflow',
          action: 'start',
          status: 'running',
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      const result = WorkflowEventSchema.safeParse(validWorkflowEvent);
      expect(result.success).toBe(true);
    });

    it('should validate workflow event with progress', () => {
      const workflowEventWithProgress = {
        eventType: 'workflow_events',
        channel: 'workflow-channel',
        payload: {
          workflowId: '123e4567-e89b-12d3-a456-426614174000',
          workflowName: 'TestWorkflow',
          action: 'step_complete',
          status: 'running',
          timestamp: new Date().toISOString(),
          progress: {
            current: 3,
            total: 10,
            percentage: 30,
          },
        },
        createdAt: new Date().toISOString(),
      };

      const result = WorkflowEventSchema.safeParse(workflowEventWithProgress);
      expect(result.success).toBe(true);
    });
  });

  describe('SystemEventSchema', () => {
    it('should validate a valid system event', () => {
      const validSystemEvent = {
        eventType: 'system_events',
        channel: 'system-channel',
        payload: {
          level: 'info',
          message: 'System started successfully',
          component: 'api_gateway',
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      const result = SystemEventSchema.safeParse(validSystemEvent);
      expect(result.success).toBe(true);
    });

    it('should validate system event with error details', () => {
      const systemEventWithError = {
        eventType: 'system_events',
        channel: 'system-channel',
        payload: {
          level: 'error',
          message: 'Database connection failed',
          component: 'database',
          timestamp: new Date().toISOString(),
          error: {
            name: 'ConnectionError',
            message: 'Unable to connect to database',
            stack: 'Error stack trace...',
            code: 'DB_CONNECTION_FAILED',
          },
        },
        createdAt: new Date().toISOString(),
      };

      const result = SystemEventSchema.safeParse(systemEventWithError);
      expect(result.success).toBe(true);
    });
  });

  describe('ConnectionEventSchema', () => {
    it('should validate a valid connection event', () => {
      const validConnectionEvent = {
        eventType: 'connection_events',
        channel: 'connection-channel',
        payload: {
          connectionId: '123e4567-e89b-12d3-a456-426614174000',
          sessionId: 'sess_123456789',
          action: 'connect',
          status: 'CONNECTED',
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      const result = ConnectionEventSchema.safeParse(validConnectionEvent);
      expect(result.success).toBe(true);
    });

    it('should validate connection event with client info', () => {
      const connectionEventWithClientInfo = {
        eventType: 'connection_events',
        channel: 'connection-channel',
        payload: {
          connectionId: '123e4567-e89b-12d3-a456-426614174000',
          sessionId: 'sess_123456789',
          action: 'connect',
          status: 'CONNECTED',
          timestamp: new Date().toISOString(),
          clientInfo: {
            userAgent: 'Mozilla/5.0...',
            ip: '192.168.1.1',
            clientType: 'WEB_APP',
            version: '1.0.0',
            platform: 'web',
          },
        },
        createdAt: new Date().toISOString(),
      };

      const result = ConnectionEventSchema.safeParse(connectionEventWithClientInfo);
      expect(result.success).toBe(true);
    });
  });

  describe('WebSocketMessageSchema', () => {
    it('should validate a valid WebSocket message', () => {
      const validMessage = {
        type: 'subscribe',
        channel: 'test-channel',
        payload: { data: 'test' },
        metadata: {
          timestamp: Date.now(),
          version: '1.0',
        },
      };

      const result = WebSocketMessageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should set default values for metadata', () => {
      const message = {
        type: 'ping',
      };

      const result = WebSocketMessageSchema.parse(message);
      expect(result.acknowledgment).toBe(false);
    });
  });

  describe('Authentication Schemas', () => {
    it('should validate a valid login request', () => {
      const validLogin = {
        email: 'test@example.com',
        password: 'password123',
        organizationSlug: 'test-org',
      };

      const result = LoginRequestSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('should validate a valid registration request', () => {
      const validRegistration = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        organizationName: 'Test Organization',
        organizationSlug: 'test-org',
        acceptTerms: true,
      };

      const result = RegisterRequestSchema.safeParse(validRegistration);
      expect(result.success).toBe(true);
    });

    it('should reject weak passwords', () => {
      const weakPasswordRegistration = {
        email: 'test@example.com',
        password: 'weak',
        organizationName: 'Test Organization',
        organizationSlug: 'test-org',
        acceptTerms: true,
      };

      const result = RegisterRequestSchema.safeParse(weakPasswordRegistration);
      expect(result.success).toBe(false);
    });
  });

  describe('Validation Helper Functions', () => {
    it('should validate APIX event with helper function', () => {
      const event = {
        eventType: 'test_event',
        channel: 'test-channel',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString(),
      };

      const result = validateApixEvent(event);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should validate event by type', () => {
      const agentEvent = {
        eventType: 'agent_events',
        channel: 'agent-channel',
        payload: {
          agentId: '123e4567-e89b-12d3-a456-426614174000',
          agentName: 'TestAgent',
          action: 'start',
          status: 'running',
          timestamp: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
      };

      const result = validateEventByType('agent_events', agentEvent);
      expect(result.success).toBe(true);
    });

    it('should transform and validate event', () => {
      const event = {
        eventType: 'test_event',
        channel: 'test-channel',
        payload: { message: 'Hello World' },
        createdAt: new Date().toISOString(),
      };

      const result = validateAndTransformEvent(event);
      expect(result.success).toBe(true);
      expect(result.event?.id).toBeDefined();
      expect(result.event?.createdAt).toBeDefined();
    });

    it('should sanitize sensitive payload data', () => {
      const payload = {
        message: 'Hello World',
        password: 'secret123',
        apiKey: 'key123',
        token: 'token123',
        normalField: 'value',
      };

      const sanitized = sanitizeEventPayload(payload);
      expect(sanitized.message).toBe('Hello World');
      expect(sanitized.normalField).toBe('value');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.apiKey).toBe('[REDACTED]');
      expect(sanitized.token).toBe('[REDACTED]');
    });
  });

  describe('Utility Functions', () => {
    it('should create valid event IDs', () => {
      const eventId = createEventId();
      expect(eventId).toMatch(/^evt_\d+_[a-z0-9]+$/);
    });

    it('should create valid session IDs', () => {
      const sessionId = createSessionId();
      expect(sessionId).toMatch(/^sess_\d+_[a-z0-9]+$/);
    });

    it('should validate event types', () => {
      expect(isValidEventType('agent_events')).toBe(true);
      expect(isValidEventType('tool_events')).toBe(true);
      expect(isValidEventType('invalid_type')).toBe(false);
    });

    it('should get correct schema for event type', () => {
      const agentSchema = getEventSchema('agent_events');
      expect(agentSchema).toBe(AgentEventSchema);

      const toolSchema = getEventSchema('tool_events');
      expect(toolSchema).toBe(ToolEventSchema);

      const defaultSchema = getEventSchema('unknown_type');
      expect(defaultSchema).toBe(ApixEventSchema);
    });
  });

  describe('Schema Registry', () => {
    it('should contain all expected schemas', () => {
      expect(SCHEMA_REGISTRY.ApixEvent).toBe(ApixEventSchema);
      expect(SCHEMA_REGISTRY.AgentEvent).toBe(AgentEventSchema);
      expect(SCHEMA_REGISTRY.ToolEvent).toBe(ToolEventSchema);
      expect(SCHEMA_REGISTRY.WebSocketMessage).toBe(WebSocketMessageSchema);
    });
  });

  describe('Constants', () => {
    it('should have correct event types', () => {
      expect(EVENT_TYPES.AGENT).toBe('agent_events');
      expect(EVENT_TYPES.TOOL).toBe('tool_events');
      expect(EVENT_TYPES.WORKFLOW).toBe('workflow_events');
    });

    it('should have correct client types', () => {
      expect(CLIENT_TYPES.WEB_APP).toBe('WEB_APP');
      expect(CLIENT_TYPES.MOBILE_APP).toBe('MOBILE_APP');
      expect(CLIENT_TYPES.API_CLIENT).toBe('API_CLIENT');
    });
  });
});
