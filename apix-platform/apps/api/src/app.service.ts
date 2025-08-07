import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; timestamp: string; version: string } {
    return {
      message: 'APIX Real-Time Backend is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  getStatus() {
    return {
      service: 'APIX Real-Time Backend',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      components: {
        websocket: 'operational',
        redis: 'operational',
        database: 'operational',
        eventRouter: 'operational',
        messageQueue: 'operational',
      },
    };
  }
}
