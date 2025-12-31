import { SetMetadata } from '@nestjs/common';

export const RPC_METHOD_METADATA = 'rpc:method';

export const RpcMethod = (name: string) =>
  SetMetadata(RPC_METHOD_METADATA, name);
