import { devConfig } from '@packages/config';
import Redis from 'ioredis';

export const redisClient = new Redis({
  host: devConfig.redis.host,
  port: devConfig.redis.port,
  password: devConfig.redis.password,
  db: devConfig.redis.db,
  lazyConnect: true,
});
