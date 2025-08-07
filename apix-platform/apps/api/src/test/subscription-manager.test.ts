import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionManagerService } from '../modules/subscription-manager/subscription-manager.service';
import { TenantDatabaseService } from '../common/services/tenant-database.service';
import { TenantAwareService } from '../common/services/tenant-aware.service';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

describe('SubscriptionManagerService', () => {
  let service: SubscriptionManagerService;
  let tenantAwareService: TenantAwareService;
  let prismaService: PrismaService;
  let module: TestingModule;

  // Test data
  const testOrgId = 'test-org-subscription';
  const testUserId = 'test-user-subscription';
  const testChannel = 'test-channel';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        SubscriptionManagerService,
        TenantDatabaseService,
        TenantAwareService,
        PrismaService,
        {
          provide: RedisService,
          useValue: {
            getRedisInstance: jest.fn(() => ({
              setEx: jest.fn(),
              sAdd: jest.fn(),
              get: jest.fn(),
              sMembers: jest.fn(() => []),
              del: jest.fn(),
              sRem: jest.fn(),
            })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: any) => {
              const config = {
                'tenant.strictIsolation': true,
                'tenant.resourceLimits': true,
                'tenant.auditLogging': true,
                'tenant.dataEncryption': false,
                'tenant.roleBasedAccess': true,
                'tenant.sessionManagement': true,
                'tenant.realTimeMonitoring': true,
              };
              return config[key] || defaultValue;
            }),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SubscriptionManagerService>(SubscriptionManagerService);
    tenantAwareService = module.get<TenantAwareService>(TenantAwareService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Setup test data
    await setupTestData();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
    await module.close();
  });

  describe('Subscription Management', () => {
    it('should create a subscription', async () => {
      const subscription = await service.createSubscription(
        testOrgId,
        testUserId,
        testChannel,
        {
          eventTypes: ['test-event'],
          priority: 'medium',
        }
      );

      expect(subscription).toBeDefined();
      expect(subscription.organizationId).toBe(testOrgId);
      expect(subscription.userId).toBe(testUserId);
      expect(subscription.channel).toBe(testChannel);
      expect(subscription.isActive).toBe(true);
    });

    it('should get subscriptions by user', async () => {
      const subscriptions = await service.getSubscriptionsByUser(testOrgId, testUserId);
      
      expect(Array.isArray(subscriptions)).toBe(true);
      expect(subscriptions.length).toBeGreaterThan(0);
      
      const subscription = subscriptions[0];
      expect(subscription.organizationId).toBe(testOrgId);
      expect(subscription.userId).toBe(testUserId);
    });

    it('should get subscriptions by organization', async () => {
      const subscriptions = await service.getSubscriptionsByOrganization(testOrgId);
      
      expect(Array.isArray(subscriptions)).toBe(true);
      expect(subscriptions.length).toBeGreaterThan(0);
      
      const subscription = subscriptions[0];
      expect(subscription.organizationId).toBe(testOrgId);
    });

    it('should validate subscription', async () => {
      const isValid = await service.validateSubscription(testOrgId, testUserId, testChannel);
      expect(isValid).toBe(true);
    });

    it('should apply filters correctly', async () => {
      const subscription = {
        id: 'test-id',
        organizationId: testOrgId,
        userId: testUserId,
        channel: testChannel,
        filters: {
          eventTypes: ['allowed-event'],
          priority: 'medium',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      };

      // Test matching event
      const matchingEvent = {
        eventType: 'allowed-event',
        priority: 'high',
        metadata: {},
      };
      
      const shouldMatch = await service.applyFilters(subscription, matchingEvent);
      expect(shouldMatch).toBe(true);

      // Test non-matching event
      const nonMatchingEvent = {
        eventType: 'blocked-event',
        priority: 'high',
        metadata: {},
      };
      
      const shouldNotMatch = await service.applyFilters(subscription, nonMatchingEvent);
      expect(shouldNotMatch).toBe(false);
    });

    it('should update subscription', async () => {
      // First create a subscription
      const subscription = await service.createSubscription(
        testOrgId,
        testUserId,
        'update-test-channel',
        { eventTypes: ['original'] }
      );

      // Update it
      const updated = await service.updateSubscription(subscription.id, {
        filters: { eventTypes: ['updated'] },
        isActive: true,
      });

      expect(updated).toBeDefined();
      expect(updated.filters.eventTypes).toContain('updated');
    });

    it('should delete subscription', async () => {
      // First create a subscription
      const subscription = await service.createSubscription(
        testOrgId,
        testUserId,
        'delete-test-channel',
        { eventTypes: ['to-delete'] }
      );

      // Delete it
      const success = await service.deleteSubscription(subscription.id);
      expect(success).toBe(true);

      // Verify it's marked as inactive
      const deleted = await service.getSubscription(subscription.id);
      expect(deleted).toBeNull(); // Should not be returned since it's inactive
    });
  });

  // Helper functions
  async function setupTestData() {
    try {
      // Create test organization
      await prismaService.organization.upsert({
        where: { id: testOrgId },
        update: {},
        create: {
          id: testOrgId,
          name: 'Test Subscription Organization',
          slug: 'test-subscription-org',
          settings: {},
        },
      });

      // Create test user
      await prismaService.user.upsert({
        where: { id: testUserId },
        update: {},
        create: {
          id: testUserId,
          email: 'subscription-test@test.com',
          firstName: 'Subscription',
          lastName: 'Test',
          passwordHash: 'hashedpassword',
          organizationId: testOrgId,
        },
      });
    } catch (error) {
      console.warn('Test data setup failed:', error.message);
    }
  }

  async function cleanupTestData() {
    try {
      // Clean up subscriptions
      await prismaService.apiXSubscription.deleteMany({
        where: {
          organizationId: testOrgId,
        },
      });

      // Clean up user
      await prismaService.user.deleteMany({
        where: {
          id: testUserId,
        },
      });

      // Clean up organization
      await prismaService.organization.deleteMany({
        where: {
          id: testOrgId,
        },
      });
    } catch (error) {
      console.warn('Test data cleanup failed:', error.message);
    }
  }
});
