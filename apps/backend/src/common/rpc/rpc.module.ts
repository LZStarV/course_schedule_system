import { Module, Global } from '@nestjs/common';
import { RpcRegistry } from './rpc.registry';

@Global()
@Module({
  providers: [RpcRegistry],
  exports: [RpcRegistry],
})
export class RpcModule {}
