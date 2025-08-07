import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import configuration
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { authConfig } from './config/auth.config';
import { websocketConfig } from './config/websocket.config';

// Import common modules
import { RedisModule } from './common/redis.module';
import { DatabaseModule } from './common/database.module';

// Import modules
import { AuthModule } from './modules/auth/auth.module';
import { ApixGatewayModule } from './modules/apix-gateway/apix-gateway.module';
import { EventRouterModule } from './modules/event-router/event-router.module';
import { SubscriptionManagerModule } from './modules/subscription-manager/subscription-manager.module';
import { MessageQueueModule } from './modules/message-queue/message-queue.module';
import { ConnectionManagerModule } from './modules/connection-manager/connection-manager.module';
import { RetryManagerModule } from './modules/retry-manager/retry-manager.module';
import { LatencyTrackerModule } from './modules/latency-tracker/latency-tracker.module';
import { AuditLoggerModule } from './modules/audit-logger/audit-logger.module';
import { RBACModule } from './modules/rbac/rbac.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, authConfig, websocketConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Throttling
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Bull Queue (Redis-based)
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
          password: process.env.REDIS_PASSWORD,
          db: parseInt(process.env.REDIS_DB || '0'),
        },
      }),
    }),

    // Common modules
    RedisModule,
    DatabaseModule,

    // Core modules
    AuthModule,
    ApixGatewayModule,
    EventRouterModule,
    SubscriptionManagerModule,
    MessageQueueModule,
    ConnectionManagerModule,
    RetryManagerModule,
    LatencyTrackerModule,
    AuditLoggerModule,
    RBACModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
