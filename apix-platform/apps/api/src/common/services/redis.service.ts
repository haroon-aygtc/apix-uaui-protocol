import { Injectable, Logger } from '@nestjs/common';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;
  private isConnected = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      this.logger.warn('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  async onModuleInit() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.client.disconnect();
    }
  }

  getRedisInstance(): RedisClientType {
    return this.client;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    const result = await this.client.get(key);
    return result as string | null;
  }

  async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  async exists(key: string): Promise<number> {
    return await this.client.exists(key);
  }

  async expire(key: string, ttl: number): Promise<number> {
    return await this.client.expire(key, ttl);
  }

  async sadd(key: string, members: string[]): Promise<number> {
    return await this.client.sAdd(key, members);
  }

  async srem(key: string, members: string[]): Promise<number> {
    return await this.client.sRem(key, members);
  }

  async smembers(key: string): Promise<string[]> {
    const result = await this.client.sMembers(key);
    return result as string[];
  }

  async sismember(key: string, member: string): Promise<number> {
    return await this.client.sIsMember(key, member);
  }

  async lpush(key: string, elements: string[]): Promise<number> {
    return await this.client.lPush(key, elements);
  }

  async rpush(key: string, elements: string[]): Promise<number> {
    return await this.client.rPush(key, elements);
  }

  async lpop(key: string): Promise<string | null> {
    const result = await this.client.lPop(key);
    return result as string | null;
  }

  async rpop(key: string): Promise<string | null> {
    const result = await this.client.rPop(key);
    return result as string | null;
  }

  async llen(key: string): Promise<number> {
    return await this.client.lLen(key);
  }

  async publish(channel: string, message: string | object): Promise<number> {
    const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
    return await this.client.publish(channel, messageStr);
  }

  async subscribe(channel: string, callback: (message: any) => void): Promise<void> {
    const subscriber = this.client.duplicate();
    await subscriber.connect();

    await subscriber.subscribe(channel, (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      } catch (error) {
        callback(message);
      }
    });
  }

  async readFromStream(streamKey: string, startId?: string, count?: number): Promise<any[]> {
    try {
      const result = await this.client.xRead(
        { key: streamKey, id: startId || '0' },
        {
          COUNT: count || 10,
          BLOCK: 0,
        }
      );

      if (!result) return [];

      return result[0].messages.map(msg => ({
        id: msg.id,
        fields: msg.message
      }));
    } catch (error) {
      return [];
    }
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    return await this.client.hIncrBy(key, field, increment);
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    return await this.client.zAdd(key, { score, value: member });
  }

  async zrangebyscore(key: string, min: number, max: number, options?: {
    limit?: { offset: number; count: number };
  }): Promise<string[]> {
    if (options?.limit) {
      return await this.client.zRangeByScore(key, min, max, {
        LIMIT: {
          offset: options.limit.offset,
          count: options.limit.count,
        },
      });
    }
    return await this.client.zRangeByScore(key, min, max);
  }

  async xlen(key: string): Promise<number> {
    return await this.client.xLen(key);
  }

  async call(command: string, ...args: any[]): Promise<any> {
    return await this.client.sendCommand([command, ...args]);
  }

  async sendCommand(command: string[]): Promise<any> {
    return await this.client.sendCommand(command);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async incrBy(key: string, increment: number): Promise<number> {
    return await this.client.incrBy(key, increment);
  }

  async decrBy(key: string, decrement: number): Promise<number> {
    return await this.client.decrBy(key, decrement);
  }

  async keys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }

  async createConsumerGroup(streamKey: string, groupName: string, startId: string): Promise<void> {
    try {
      await this.client.xGroupCreate(streamKey, groupName, startId, { MKSTREAM: true });
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        throw error;
      }
    }
  }

  async addToStream(streamKey: string, data: any, maxLength?: number): Promise<string> {
    const fields = this.flattenObject(data);
    return await this.client.xAdd(streamKey, '*', fields, { TRIM: { strategy: 'MAXLEN', threshold: maxLength || 1000 } });
  }

  async readFromConsumerGroup(streamKey: string, groupName: string, consumerName: string, count?: number, block?: number): Promise<any[]> {
    const result = await this.client.xReadGroup(groupName, consumerName, { key: streamKey, id: '>' }, { COUNT: count, BLOCK: block });
    if (!result) return [];
    
    return result[0].messages.map(msg => ({
      id: msg.id,
      fields: msg.message
    }));
  }

  async acknowledgeMessage(streamKey: string, groupName: string, messageId: string): Promise<void> {
    await this.client.xAck(streamKey, groupName, messageId);
  }

  async getConsumerGroupInfo(streamKey: string): Promise<any> {
    try {
      const info = await this.client.xInfoGroups(streamKey);
      return info;
    } catch (error) {
      return [];
    }
  }

  private flattenObject(obj: any, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          Object.assign(flattened, this.flattenObject(value, newKey));
        } else {
          flattened[newKey] = typeof value === 'string' ? value : JSON.stringify(value);
        }
      }
    }
    
    return flattened;
  }
}
