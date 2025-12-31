import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../config/redis.config';
import { devConfig } from '@packages/config';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  async use(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const key = `rate:limit:${req.path}:${req.ip}`;
    const ttl = 60;
    const max = devConfig.rateLimit.maxPerMinute;
    const tx = redisClient.multi();
    tx.incr(key);
    tx.expire(key, ttl);
    const [, count] = (await tx.exec()) as any;
    if (count && count[1] > max) {
      res
        .status(429)
        .json({ code: 429, message: 'Too Many Requests' });
      return;
    }
    next();
  }
}
