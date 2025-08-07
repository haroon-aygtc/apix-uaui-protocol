import { Test, TestingModule } from '@nestjs/testing';
import { TenantAwareService } from '../common/services/tenant-aware.service';
import { TenantDatabaseService } from '../common/services/tenant-database.service';
import { PrismaService } from '../common/services/prisma.service';
import { RedisService } from '../common/services/redis.service';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';

describe('Multi-Tenant Isolation', () => {
  let tenantAwareService: TenantAwareService;
  let tenantDatabaseService: TenantDatabaseService;
  let prismaService: PrismaService;
  let module: TestingModule;

  // Test organizations
  const org1Id = 'org-1-test';
  const org2Id = 'org-2-test';
  const user1Id = 'user-1-test';
  const user2Id = 'user-2-test';

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        TenantAwareService,
        TenantDatabaseService,
        PrismaService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            setex: jest.fn(),
            del: jest.fn(),
            incr: jest.fn(),
            expire: jest.fn(),
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
                'tenant.limits.maxUsers': 100,
                'tenant.limits.maxConnections': 1000,
                'tenant.limits.maxEvents': 10000,
                'tenant.limits.maxChannels': 50,
                'tenant.limits.maxStorage': 1073741824,
                'tenant.limits.maxApiCalls': 10000,
                'tenant.limits.features': ['basic'],
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

    tenantAwareService = module.get<TenantAwareService>(TenantAwareService);
    tenantDatabaseService = module.get<TenantDatabaseService>(TenantDatabaseService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Setup test data
    await setupTestData();
  });

  afterAll(async () => {
    // Cleanup test data
    await cleanupTestData();
    await module.close();
  });

  describe('Tenant Context Creation', () => {
    it('should create valid tenant context', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);
      
      expect(context).toBeDefined();
      expect(context.organizationId).toBe(org1Id);
      expect(context.userId).toBe(user1Id);
    });

    it('should validate tenant context', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);
      
      await expect(tenantAwareService.validateTenantContext(context)).resolves.not.toThrow();
    });

    it('should reject invalid organization', async () => {
      await expect(
        tenantAwareService.createTenantContext('invalid-org', user1Id)
      ).rejects.toThrow();
    });
  });

  describe('Cross-Tenant Access Prevention', () => {
    it('should prevent cross-tenant data access', async () => {
      const context1 = await tenantAwareService.createTenantContext(org1Id, user1Id);
      const context2 = await tenantAwareService.createTenantContext(org2Id, user2Id);

      // Create data in org1
      const data1 = await tenantDatabaseService.create(context1, 'apiXEvent', {
        type: 'test',
        payload: { message: 'org1 data' },
        channelId: 'channel-1',
        userId: user1Id,
      }) as { id: string };

      // Try to access org1 data from org2 context
      const results = await tenantDatabaseService.findMany(context2, 'apiXEvent', {
        where: { id: data1.id },
      });

      expect(results).toHaveLength(0); // Should not find org1 data
    });

    it('should isolate user data by organization', async () => {
      const context1 = await tenantAwareService.createTenantContext(org1Id, user1Id);
      const context2 = await tenantAwareService.createTenantContext(org2Id, user2Id);

      // Get users for each organization
      const org1Users = await tenantDatabaseService.findMany(context1, 'user', {}) as Array<{ id: string }>;
      const org2Users = await tenantDatabaseService.findMany(context2, 'user', {}) as Array<{ id: string }>;

      // Verify no cross-tenant user access
      const org1UserIds = org1Users.map(u => u.id);
      const org2UserIds = org2Users.map(u => u.id);

      expect(org1UserIds).not.toContain(user2Id);
      expect(org2UserIds).not.toContain(user1Id);
    });
  });

  describe('Role-Based Access Control', () => {
    it('should create and assign roles', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      // Create a custom role
      const role = await tenantAwareService.createRole(context, {
        name: 'test-role',
        description: 'Test role for isolation testing',
        permissions: ['test:read', 'test:write'],
      });

      expect(role).toBeDefined();
      expect(role.name).toBe('test-role');
      expect(role.organizationId).toBe(org1Id);

      // Assign role to user
      const userRole = await tenantAwareService.assignUserRole(
        context,
        user1Id,
        role.id
      );

      expect(userRole).toBeDefined();
      expect(userRole.userId).toBe(user1Id);
      expect(userRole.roleId).toBe(role.id);
    });

    it('should check user permissions', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      // Check if user has permission
      const hasPermission = await tenantAwareService.hasPermission(
        context,
        'test:read'
      );

      expect(typeof hasPermission).toBe('boolean');
    });

    it('should prevent cross-tenant role access', async () => {
      const context1 = await tenantAwareService.createTenantContext(org1Id, user1Id);
      const context2 = await tenantAwareService.createTenantContext(org2Id, user2Id);

      // Create role in org1
      const role1 = await tenantAwareService.createRole(context1, {
        name: 'org1-role',
        permissions: ['org1:access'],
      });

      // Try to assign org1 role to org2 user (should fail)
      await expect(
        tenantAwareService.assignUserRole(context2, user2Id, role1.id)
      ).rejects.toThrow();
    });
  });

  describe('Resource Limits and Quotas', () => {
    it('should enforce resource limits', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      // Check resource limits
      await expect(
        tenantAwareService.checkResourceLimits(context, 'User')
      ).resolves.not.toThrow();
    });

    it('should track resource usage', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      const usage = await tenantAwareService.getTenantUsage(org1Id);
      expect(usage).toBeDefined();
      expect(typeof usage.users).toBe('number');
      expect(typeof usage.connections).toBe('number');
    });

    it('should get tenant health status', async () => {
      const health = await tenantAwareService.getTenantHealth(org1Id);
      
      expect(health).toBeDefined();
      expect(health.status).toMatch(/^(healthy|warning|critical)$/);
      expect(health.usage).toBeDefined();
      expect(health.limits).toBeDefined();
    });
  });

  describe('Audit Logging', () => {
    it('should log audit events', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      await expect(
        tenantAwareService.logAuditEvent(
          context,
          'TEST',
          'TestResource',
          'test-id',
          null,
          { test: 'data' }
        )
      ).resolves.not.toThrow();
    });

    it('should retrieve audit trail', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      const auditTrail = await tenantAwareService.getAuditTrail(context);
      expect(Array.isArray(auditTrail)).toBe(true);
    });

    it('should generate compliance reports', async () => {
      const context = await tenantAwareService.createTenantContext(org1Id, user1Id);

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const endDate = new Date();

      const report = await tenantAwareService.generateComplianceReport(
        context,
        startDate,
        endDate,
        'GDPR'
      );

      expect(report).toBeDefined();
      expect(report.complianceType).toBe('GDPR');
      expect(report.organizationId).toBe(org1Id);
      expect(Array.isArray(report.events)).toBe(true);
    });
  });

  // Helper functions
  async function setupTestData() {
    try {
      // Create test organizations
      await prismaService.organization.upsert({
        where: { id: org1Id },
        update: {},
        create: {
          id: org1Id,
          name: 'Test Organization 1',
          slug: 'test-org-1',
          settings: {},
        },
      });

      await prismaService.organization.upsert({
        where: { id: org2Id },
        update: {},
        create: {
          id: org2Id,
          name: 'Test Organization 2',
          slug: 'test-org-2',
          settings: {},
        },
      });

      // Create test users
      await prismaService.user.upsert({
        where: { id: user1Id },
        update: {},
        create: {
          id: user1Id,
          email: 'user1@test.com',
          firstName: 'User',
          lastName: 'One',
          passwordHash: 'hashedpassword',
          organizationId: org1Id,
        },
      });

      await prismaService.user.upsert({
        where: { id: user2Id },
        update: {},
        create: {
          id: user2Id,
          email: 'user2@test.com',
          firstName: 'User',
          lastName: 'Two',
          passwordHash: 'hashedpassword',
          organizationId: org2Id,
        },
      });
    } catch (error) {
      console.warn('Test data setup failed:', error.message);
    }
  }

  async function cleanupTestData() {
    try {
      // Clean up in reverse order due to foreign key constraints
      await prismaService.auditLog.deleteMany({
        where: {
          organizationId: { in: [org1Id, org2Id] },
        },
      });

      await prismaService.userRole.deleteMany({
        where: {
          userId: { in: [user1Id, user2Id] },
        },
      });

      await prismaService.role.deleteMany({
        where: {
          organizationId: { in: [org1Id, org2Id] },
          isSystem: false,
        },
      });

      await prismaService.user.deleteMany({
        where: {
          id: { in: [user1Id, user2Id] },
        },
      });

      await prismaService.organization.deleteMany({
        where: {
          id: { in: [org1Id, org2Id] },
        },
      });
    } catch (error) {
      console.warn('Test data cleanup failed:', error.message);
    }
  }
});
