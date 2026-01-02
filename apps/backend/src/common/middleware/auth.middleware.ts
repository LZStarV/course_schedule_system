import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      try {
        const jwt = new JwtService({
          secret: jwtConfig.accessSecret,
        });
        const payload: any = jwt.verify(token);
        (req as any).user = {
          id: payload?.sub,
          username: payload?.username,
          role: payload?.role,
          token,
        };
      } catch {
        (req as any).user = { token };
      }
    }
    next();
  }
}
