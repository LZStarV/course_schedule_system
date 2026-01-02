import { http } from '@api/client';
import { devConfig } from '@packages/config';
import { REQUEST_TIMEOUT_MS } from '@/config/request';

export type RpcOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
};

/**
 * 调用单个 RPC 方法，返回 JSON‑RPC 的 result。
 * @param method 方法名，如 "Auth.Login"
 * @param params 参数对象
 * @param options 可选的超时与取消控制
 */
export async function call<T>(
  method: string,
  params: Record<string, unknown>,
  options?: RpcOptions
) {
  const url = `${devConfig.backend.apiPrefix}/${method}`;
  const res = await http.post(url, params, {
    timeout: options?.timeoutMs ?? REQUEST_TIMEOUT_MS,
    signal: options?.signal,
  });
  const data = res.data as any;
  if (data?.error)
    throw new Error(data.error.message || 'RPC_ERROR');
  return data?.result as T;
}

/**
 * 发送通知（不需要响应）。仅当后端收到 JSON‑RPC 封套且无 id 时视为通知。
 * @param method 方法名
 * @param params 参数对象
 * @param options 可选的超时与取消控制
 */
export async function notify(
  method: string,
  params: Record<string, unknown>,
  options?: RpcOptions
) {
  const url = `${devConfig.backend.apiPrefix}/${method}`;
  const envelope = { jsonrpc: '2.0', method, params };
  await http.post(url, envelope, {
    timeout: options?.timeoutMs ?? REQUEST_TIMEOUT_MS,
    signal: options?.signal,
  });
}

/**
 * 批量封装：以 Promise.all 并行调用多个方法，返回结果数组。
 * @param requests 请求数组（方法名与参数）
 * @param options 可选的统一超时与取消控制
 */
export async function batch(
  requests: Array<{
    method: string;
    params: Record<string, unknown>;
  }>,
  options?: RpcOptions
) {
  const results = await Promise.all(
    requests.map(r =>
      call<any>(r.method, r.params, options)
    )
  );
  return results;
}
