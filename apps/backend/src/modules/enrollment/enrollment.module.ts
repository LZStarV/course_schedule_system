import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enrollment } from '../../models/enrollment.model';

@Module({
  imports: [SequelizeModule.forFeature([Enrollment])],
  providers: [EnrollmentService, EnrollmentController],
})
export class EnrollmentModule {}
