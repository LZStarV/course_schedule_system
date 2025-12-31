import { call } from '@api/rpc';

export async function setSelectTime(params: {
  startTime: string;
  endTime: string;
}) {
  return await call<{ updated: boolean }>(
    'Admin.SetSelectTime',
    params
  );
}
