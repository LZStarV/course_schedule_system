import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatsSystemController } from './stats-system.controller';
import { StatsSystemService } from './stats-system.service';
import { User } from '../../models/user.model';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';
import { Department } from '../../models/department.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Course,
      Enrollment,
      Department,
    ]),
  ],
  providers: [StatsSystemService, StatsSystemController],
})
export class StatsSystemModule {}
