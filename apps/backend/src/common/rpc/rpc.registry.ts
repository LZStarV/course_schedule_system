import { Injectable } from '@nestjs/common';

type Handler = (
  params: Record<string, unknown>,
  context?: Record<string, unknown>
) => Promise<unknown> | unknown;

@Injectable()
export class RpcRegistry {
  private handlers = new Map<string, Handler>();

  register(method: string, handler: Handler) {
    this.handlers.set(method, handler);
  }

  has(method: string) {
    return this.handlers.has(method);
  }

  async dispatch(
    method: string,
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const handler = this.handlers.get(method);
    if (!handler) {
      throw new Error(`RPC method not found: ${method}`);
    }
    return await handler(params, context);
  }
}
