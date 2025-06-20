import { injectable } from 'inversify';
import { createClient } from 'redis';
import { ICacheService } from '../interfaces';
import env from '../env';

@injectable()
export class RedisCacheService implements ICacheService {
  private redisClient;

  constructor() {
    this.redisClient = createClient({ url: env.REDIS_URI });
    this.setupConnection();
  }

  private async setupConnection(): Promise<void> {
    this.redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    try {
      await this.redisClient.connect();
      console.log('Redis connected successfully!');
    } catch (err) {
      console.error('Redis connection failed:', err);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.setEx(key, ttl, value);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.redisClient.exists(key)) === 1;
  }

  async clear(): Promise<void> {
    await this.redisClient.flushAll();
  }

  async zAdd(key: string, score: number, member: string): Promise<void> {
    await this.redisClient.zAdd(key, { score, value: member });
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.redisClient.zRange(key, start, stop, { REV: true });
  }

  async zRemRangeByScore(key: string, min: number, max: number): Promise<void> {
    await this.redisClient.zRemRangeByScore(key, min, max);
  }
}