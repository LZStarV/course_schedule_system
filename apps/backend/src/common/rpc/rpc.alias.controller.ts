import {
  Body,
  Controller,
  Post,
  Req,
  Inject,
  Param,
} from '@nestjs/common';
import type { Request } from 'express';
import { RpcRegistry } from './rpc.registry';
import { logger } from '../logger';
import { devConfig } from '@packages/config';

/**
 * 语义化 RPC 别名控制器
 *
 * 提供 POST {apiPrefix}/:method 的简洁调用方式（例如 /api/Auth.Login）。
 * - 如果请求体是普通对象：视为 params，始终返回 JSON-RPC 响应（非通知）。
 * - 如果请求体是 JSON-RPC 封套：遵循封套语义；当 id 缺省时视为通知（不返回响应）。
 */

@Controller(devConfig.backend.apiPrefix)
export class RpcAliasController {
  constructor(
    @Inject(RpcRegistry)
    private readonly registry: RpcRegistry
  ) {}

  @Post(':method')
  async handle(
    @Param('method') method: string,
    @Body() raw: any,
    @Req() request: Request
  ) {
    const ctx = { user: (request as any).user } as Record<
      string,
      unknown
    >;
    const isEnvelope = raw && raw.jsonrpc === '2.0';
    const body = isEnvelope
      ? {
          jsonrpc: '2.0',
          id: raw.id,
          method,
          params: raw.params,
        }
      : {
          jsonrpc: '2.0',
          id: null,
          method,
          params: raw,
        };
    const start = Date.now();
    const id = body.id;
    try {
      const data = await this.registry.dispatch(
        body.method,
        body.params ?? {},
        ctx
      );
      logger.info({
        id,
        method: body.method,
        duration: Date.now() - start,
      });
      // 通知仅适用于 JSON-RPC 封套且未携带 id 的情况
      if (isEnvelope && id === undefined) return;
      return {
        jsonrpc: '2.0',
        id: id ?? null,
        result: data,
      };
    } catch (e: any) {
      const msg = e?.message || '';
      const err = msg.startsWith('RPC method not found')
        ? { code: -32601, message: 'Method not found' }
        : {
            code: -32603,
            message: e?.message || 'Internal error',
          };
      logger.error({
        id,
        method: body.method,
        error: err.message,
        duration: Date.now() - start,
      });
      if (isEnvelope && id === undefined) return;
      return { jsonrpc: '2.0', id: id ?? null, error: err };
    }
  }
}
