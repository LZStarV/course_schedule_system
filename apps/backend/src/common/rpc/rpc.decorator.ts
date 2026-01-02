import { SetMetadata } from '@nestjs/common';

export const RPC_METHOD_METADATA = 'rpc:method';

/**
 * 为控制器/方法标注 RPC 方法名的装饰器
 *
 * 用途：在模块初始化时可读取该元数据，将方法名注册到 RpcRegistry。
 */
export const RpcMethod = (name: string) =>
  SetMetadata(RPC_METHOD_METADATA, name);
