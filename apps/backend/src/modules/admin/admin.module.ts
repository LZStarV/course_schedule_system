import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RpcModule } from '../../common/rpc/rpc.module';

@Module({
  imports: [RpcModule],
  providers: [AdminService, AdminController],
})
export class AdminModule {}
