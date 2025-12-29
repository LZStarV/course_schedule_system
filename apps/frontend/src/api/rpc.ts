import { http } from '@api/client';
import { devConfig } from '@packages/config';
import type { RpcResponse } from '@packages/shared-types';

const uuid = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

export async function call<T>(
  method: string,
  params: Record<string, unknown>,
  meta?: { version?: string }
) {
  const body = { id: uuid(), method, params, meta };
  const res = await http.post<RpcResponse<T>>(devConfig.backend.rpcPath, body);
  const data = res.data;
  if (data.code !== 0) throw new Error(data.message || 'RPC_ERROR');
  return data.data;
}
