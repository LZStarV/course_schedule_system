import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enrollment } from '../../models/enrollment.model';
import { RpcModule } from '../../common/rpc/rpc.module';

@Module({
  imports: [SequelizeModule.forFeature([Enrollment]), RpcModule],
  providers: [EnrollmentService, EnrollmentController],
})
export class EnrollmentModule {}
