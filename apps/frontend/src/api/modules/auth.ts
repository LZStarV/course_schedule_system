import { call } from '@api/rpc';
import type { User } from '@packages/shared-types';

export async function login(params: { username: string; password: string }) {
  return await call<{
    token: string;
    refreshToken: string;
    user: Pick<User, 'id' | 'username' | 'role'>;
  }>('Auth.Login', params, { version: 'v1' });
}

export async function getPermissions() {
  return await call<{ permissions: Record<string, unknown>; menus: Record<string, unknown> }>(
    'Auth.GetPermissions',
    {}
  );
}
