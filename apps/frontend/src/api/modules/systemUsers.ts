import { call } from '@api/rpc';
import type { PaginatedResponse, User } from '@packages/shared-types';

export async function listUsers(params: {
  keyword?: string;
  role?: string;
  status?: string;
  page?: number;
  page_size?: number;
}) {
  return await call<PaginatedResponse<User>>('Admin.ListUsers', params);
}

export async function createUser(payload: {
  username: string;
  email: string;
  role: string;
  status: string;
  password: string;
}) {
  return await call<{ ok: boolean }>('Admin.CreateUser', payload);
}

export async function updateUser(
  id: string,
  payload: Partial<{ email: string; role: string; status: string; password?: string }>
) {
  return await call<{ ok: boolean }>('Admin.UpdateUser', { id, ...payload });
}

export async function deleteUser(id: string) {
  return await call<{ ok: boolean }>('Admin.DeleteUser', { id });
}
