import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Enrollment } from '../../models/enrollment.model';
import { ClassSchedule } from '../../models/class-schedule.model';
import { Course } from '../../models/course.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Enrollment,
      ClassSchedule,
      Course,
    ]),
  ],
  providers: [EnrollmentService, EnrollmentController],
})
export class EnrollmentModule {}
