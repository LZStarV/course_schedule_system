import { Module, Global } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { RpcRegistry } from './rpc.registry';
import { RpcDiscoveryProvider } from './rpc.discovery';

/**
 * 全局 RPC 模块
 *
 * 提供 RpcRegistry 作为全局单例，便于各业务模块在初始化阶段注册方法。
 */
@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [RpcRegistry, RpcDiscoveryProvider],
  exports: [RpcRegistry],
})
export class RpcModule {}
