import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionManagerService } from '../../src/modules/connection-manager/connection-manager.service';
import { RetryManagerService } from '../../src/modules/retry-manager/retry-manager.service';
import { ConnectionHealthMonitorService } from '../../src/modules/connection-manager/connection-health-monitor.service';
import { PrismaService } from '../../src/common/services/prisma.service';
import { RedisService } from '../../src/common/services/redis.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Connection & Retry Management Integration Tests', () => {
  let connectionManager: ConnectionManagerService;
  let retryManager: RetryManagerService;
  let healthMonitor: ConnectionHealthMonitorService;
  let prismaService: PrismaService;
  let eventEmitter: EventEmitter2;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionManagerService,
        RetryManagerService,
        ConnectionHealthMonitorService,
        {
          provide: PrismaService,
          useValue: {
            apiXConnection: {
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn().mockResolvedValue([]),
              updateMany: jest.fn(),
            },
          },
        },
        {
          provide: RedisService,
          useValue: {
            publish: jest.fn(),
            getRedisInstance: jest.fn().mockReturnValue({
              setex: jest.fn(),
              get: jest.fn(),
              del: jest.fn(),
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config = {
                'connection.retry.maxAttempts': 3,
                'connection.retry.baseDelay': 1000,
                'connection.retry.maxDelay': 10000,
                'connection.retry.backoffMultiplier': 2,
                'connection.retry.jitter': true,
                'connection.retry.resetAfter': 300000,
                'connection.heartbeat.interval': 30000,
                'connection.heartbeat.timeout': 5000,
                'connection.heartbeat.maxMissed': 3,
                'health.thresholds.maxAverageLatency': 1000,
                'health.thresholds.maxErrorRate': 0.1,
                'health.monitoring.interval': 30000,
              };
              return config[key] || defaultValue;
            }),
          },
        },
        EventEmitter2,
      ],
    }).compile();

    connectionManager = module.get<ConnectionManagerService>(ConnectionManagerService);
    retryManager = module.get<RetryManagerService>(RetryManagerService);
    healthMonitor = module.get<ConnectionHealthMonitorService>(ConnectionHealthMonitorService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    await connectionManager.onModuleInit();
    await healthMonitor.onModuleInit();
  });

  afterAll(async () => {
    await connectionManager.onModuleDestroy();
    await healthMonitor.onModuleDestroy();
  });

  describe('Connection Management', () => {
    it('should register a new connection', async () => {
      const sessionId = 'test-session-1';
      const userId = 'user-1';
      const organizationId = 'org-1';
      const clientType = 'WEB_APP';

      const connection = await connectionManager.registerConnection(
        sessionId,
        userId,
        organizationId,
        clientType,
        { userAgent: 'test-agent' }
      );

      expect(connection).toBeDefined();
      expect(connection.sessionId).toBe(sessionId);
      expect(connection.status).toBe('CONNECTED');
      expect(connection.connectionQuality).toBe('EXCELLENT');
      expect(connection.reconnectAttempts).toBe(0);
    });

    it('should update heartbeat and track latency', async () => {
      const sessionId = 'test-session-2';
      await connectionManager.registerConnection(sessionId, 'user-2', 'org-1', 'WEB_APP');

      const clientTimestamp = Date.now() - 100; // 100ms ago
      const result = await connectionManager.updateHeartbeat(sessionId, clientTimestamp);

      expect(result.latency).toBeGreaterThan(0);
      expect(result.quality).toBeDefined();
    });

    it('should handle connection status updates', async () => {
      const sessionId = 'test-session-3';
      await connectionManager.registerConnection(sessionId, 'user-3', 'org-1', 'WEB_APP');

      await connectionManager.updateConnectionStatus(sessionId, 'DISCONNECTED');
      
      const connection = connectionManager.getConnection(sessionId);
      expect(connection?.status).toBe('DISCONNECTED');
      expect(connection?.disconnectedAt).toBeDefined();
    });

    it('should schedule reconnection with exponential backoff', async () => {
      const sessionId = 'test-session-4';
      await connectionManager.registerConnection(sessionId, 'user-4', 'org-1', 'WEB_APP');

      const eventSpy = jest.spyOn(eventEmitter, 'emit');

      await connectionManager.scheduleReconnection(sessionId, {}, {
        type: 'EXPONENTIAL',
        parameters: {},
      });

      expect(eventSpy).toHaveBeenCalledWith('connection.reconnection.scheduled', expect.any(Object));
    });

    it('should get connection statistics', () => {
      const stats = connectionManager.getConnectionStats();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('connected');
      expect(stats).toHaveProperty('byQuality');
      expect(stats).toHaveProperty('averageLatency');
      expect(stats).toHaveProperty('totalReconnectionAttempts');
    });
  });

  describe('Retry Management', () => {
    it('should execute operation with retry on failure', async () => {
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Operation failed');
        }
        return Promise.resolve('success');
      });

      const result = await retryManager.executeWithRetry(
        'test-operation-1',
        operation,
        { type: 'EXPONENTIAL', baseDelay: 100, maxDelay: 1000 },
        3
      );

      expect(result).toBe('success');
      expect(attempts).toBe(3);
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Always fails'));

      await expect(
        retryManager.executeWithRetry(
          'test-operation-2',
          operation,
          { type: 'FIXED', baseDelay: 50 },
          2
        )
      ).rejects.toThrow('Operation test-operation-2 failed after 2 attempts');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should schedule retry operation', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      
      await retryManager.scheduleRetry(
        'test-scheduled-1',
        operation,
        { type: 'LINEAR', baseDelay: 100, maxDelay: 1000 },
        3
      );

      const status = retryManager.getRetryStatus('test-scheduled-1');
      expect(status).toBeDefined();
      expect(status?.id).toBe('test-scheduled-1');
    });

    it('should cancel retry operation', () => {
      const operation = jest.fn();
      
      retryManager.scheduleRetry(
        'test-cancel-1',
        operation,
        { type: 'FIXED', baseDelay: 1000 },
        3
      );

      const cancelled = retryManager.cancelRetry('test-cancel-1');
      expect(cancelled).toBe(true);

      const status = retryManager.getRetryStatus('test-cancel-1');
      expect(status).toBeNull();
    });

    it('should handle circuit breaker', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Service unavailable'));

      // Trigger circuit breaker by failing multiple times
      for (let i = 0; i < 5; i++) {
        try {
          await retryManager.executeWithCircuitBreaker('test-circuit', operation, 3, 1000);
        } catch (error) {
          // Expected to fail
        }
      }

      // Circuit should be open now
      await expect(
        retryManager.executeWithCircuitBreaker('test-circuit', operation, 3, 1000)
      ).rejects.toThrow('Circuit breaker test-circuit is OPEN');

      const circuitStatus = retryManager.getCircuitBreakerStatus('test-circuit');
      expect(circuitStatus?.state).toBe('OPEN');
    });
  });

  describe('Health Monitoring', () => {
    it('should collect health metrics', () => {
      const metrics = healthMonitor.getCurrentHealthMetrics();

      expect(metrics).toHaveProperty('timestamp');
      expect(metrics).toHaveProperty('totalConnections');
      expect(metrics).toHaveProperty('healthyConnections');
      expect(metrics).toHaveProperty('averageLatency');
      expect(metrics).toHaveProperty('connectionQualityDistribution');
      expect(metrics).toHaveProperty('systemLoad');
    });

    it('should get health summary', () => {
      const summary = healthMonitor.getHealthSummary();

      expect(summary).toHaveProperty('status');
      expect(summary).toHaveProperty('metrics');
      expect(summary).toHaveProperty('activeAlerts');
      expect(summary).toHaveProperty('trends');
      expect(['HEALTHY', 'WARNING', 'CRITICAL']).toContain(summary.status);
    });

    it('should track health history', () => {
      // Simulate some health data
      const currentMetrics = healthMonitor.getCurrentHealthMetrics();
      
      const history = healthMonitor.getHealthHistory(60000); // Last minute
      expect(Array.isArray(history)).toBe(true);
    });

    it('should handle alert acknowledgment', () => {
      const alerts = healthMonitor.getActiveAlerts();
      
      if (alerts.length > 0) {
        const alertId = alerts[0].id;
        const acknowledged = healthMonitor.acknowledgeAlert(alertId);
        expect(acknowledged).toBe(true);
      }
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle connection failure and retry sequence', async () => {
      const sessionId = 'integration-test-1';
      
      // Register connection
      await connectionManager.registerConnection(sessionId, 'user-int-1', 'org-1', 'WEB_APP');
      
      // Simulate connection failure
      await connectionManager.updateConnectionStatus(sessionId, 'DISCONNECTED');
      
      // Schedule reconnection
      await connectionManager.scheduleReconnection(sessionId);
      
      // Verify connection is in reconnecting state
      const connection = connectionManager.getConnection(sessionId);
      expect(connection?.status).toBe('RECONNECTING');
      expect(connection?.reconnectAttempts).toBeGreaterThan(0);
    });

    it('should monitor connection quality degradation', async () => {
      const sessionId = 'quality-test-1';
      await connectionManager.registerConnection(sessionId, 'user-quality-1', 'org-1', 'WEB_APP');

      // Simulate high latency heartbeats
      for (let i = 0; i < 5; i++) {
        const highLatencyTimestamp = Date.now() - 2000; // 2 seconds ago
        await connectionManager.updateHeartbeat(sessionId, highLatencyTimestamp);
      }

      const connection = connectionManager.getConnection(sessionId);
      expect(connection?.connectionQuality).toBe('POOR');
    });

    it('should handle system overload scenario', () => {
      // Create many connections to simulate load
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          connectionManager.registerConnection(
            `load-test-${i}`,
            `user-${i}`,
            'org-1',
            'WEB_APP'
          )
        );
      }

      return Promise.all(promises).then(() => {
        const stats = connectionManager.getConnectionStats();
        expect(stats.total).toBeGreaterThanOrEqual(10);
        
        const healthMetrics = healthMonitor.getCurrentHealthMetrics();
        expect(healthMetrics.totalConnections).toBeGreaterThanOrEqual(10);
      });
    });
  });
});
