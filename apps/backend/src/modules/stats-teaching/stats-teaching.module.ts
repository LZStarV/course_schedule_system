import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatsTeachingController } from './stats-teaching.controller';
import { StatsTeachingService } from './stats-teaching.service';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Course, Enrollment]),
  ],
  providers: [
    StatsTeachingService,
    StatsTeachingController,
  ],
})
export class StatsTeachingModule {}
