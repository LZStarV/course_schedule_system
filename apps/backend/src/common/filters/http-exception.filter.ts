import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { logger } from '../logger';
import { devConfig } from '@packages/config';

/**
 * 全局 HTTP 异常过滤器
 *
 * 作用：统一拦截 HttpException 并规范返回体。
 * - 当请求路径为 API 前缀（devConfig.backend.apiPrefix）时：
 *   - 以 JSON-RPC 2.0 错误对象形式返回，且 HTTP 状态固定为 200
 * - 非 API 前缀路径：保持传统 REST 风格，按原始 HTTP 状态码返回 { code, message }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * 拦截并格式化异常输出
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.message;
    logger.error({ status, message });
    const isApi =
      typeof request?.path === 'string' &&
      request.path.startsWith(devConfig.backend.apiPrefix);
    if (isApi) {
      response.status(200).json({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: status === 400 ? -32700 : -32603,
          message,
        },
      });
      return;
    }
    response.status(status).json({ code: status, message });
  }
}
