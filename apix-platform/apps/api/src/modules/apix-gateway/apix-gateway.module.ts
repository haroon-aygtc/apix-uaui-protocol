import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ApixGatewayGateway } from './apix-gateway.gateway';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionManagerModule } from '../subscription-manager/subscription-manager.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    AuthModule,
    SubscriptionManagerModule,
  ],
  providers: [ApixGatewayGateway],
  exports: [ApixGatewayGateway],
})
export class ApixGatewayModule {}
