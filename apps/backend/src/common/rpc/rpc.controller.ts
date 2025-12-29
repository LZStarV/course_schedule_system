import { Body, Controller, Post } from '@nestjs/common';
import { devConfig } from '@packages/config';
import { RpcRegistry } from './rpc.registry';
import { RpcRequestDto } from './rpc.types';
import { logger } from '../logger';

@Controller(devConfig.backend.rpcPath)
export class RpcController {
  constructor(private readonly registry: RpcRegistry) {}

  @Post()
  async handle(@Body() req: RpcRequestDto) {
    const start = Date.now();
    logger.info({ id: req.id, method: req.method, params: req.params });
    try {
      const data = await this.registry.dispatch(req.method, req.params, { id: req.id });
      logger.info({ id: req.id, method: req.method, duration: Date.now() - start });
      return {
        id: req.id,
        code: 0,
        message: 'OK',
        data,
        timestamp: Date.now(),
      };
    } catch (e: any) {
      logger.error({
        id: req.id,
        method: req.method,
        error: e?.message,
        duration: Date.now() - start,
      });
      return {
        id: req.id,
        code: 1,
        message: e?.message || 'ERROR',
        data: null,
        timestamp: Date.now(),
      };
    }
  }
}
