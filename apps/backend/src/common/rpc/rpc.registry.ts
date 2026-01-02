import { Injectable } from '@nestjs/common';

/**
 * RPC 方法注册表
 *
 * 职责：在应用启动期由各模块注册 handler（方法名 → 处理函数），
 * 入口控制器通过方法名分发到对应的处理函数执行。
 */

/**
 * 处理函数签名
 * @param params 方法参数（命名对象或入口层适配的结构）
 * @param context 调用上下文（如鉴权用户/请求元信息）
 * @returns 业务结果（支持同步或异步）
 */
type Handler = (
  params: Record<string, unknown>,
  context?: Record<string, unknown>
) => Promise<unknown> | unknown;

@Injectable()
export class RpcRegistry {
  private handlers = new Map<string, Handler>();

  /**
   * 注册 RPC 方法处理函数
   */
  register(method: string, handler: Handler) {
    this.handlers.set(method, handler);
  }

  /**
   * 判断方法是否已注册
   */
  has(method: string) {
    return this.handlers.has(method);
  }

  /**
   * 分发到指定方法的处理函数
   * @throws Error 当方法未注册时抛出（入口层映射为 JSON-RPC -32601）
   */
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
