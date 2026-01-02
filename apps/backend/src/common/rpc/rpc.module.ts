import { Module, Global } from '@nestjs/common';
import { RpcRegistry } from './rpc.registry';

/**
 * 全局 RPC 模块
 *
 * 提供 RpcRegistry 作为全局单例，便于各业务模块在初始化阶段注册方法。
 */
@Global()
@Module({
  providers: [RpcRegistry],
  exports: [RpcRegistry],
})
export class RpcModule {}
