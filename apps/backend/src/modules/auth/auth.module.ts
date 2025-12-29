import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { RpcModule } from '../../common/rpc/rpc.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), RpcModule],
  providers: [AuthService, AuthController],
})
export class AuthModule {}
