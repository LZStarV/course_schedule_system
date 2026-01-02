import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeachingScheduleController } from './teaching-schedule.controller';
import { TeachingScheduleService } from './teaching-schedule.service';
import { ClassSchedule } from '../../models/class-schedule.model';
import { ScheduleChangeRequest } from '../../models/schedule-change-request.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ClassSchedule,
      ScheduleChangeRequest,
    ]),
  ],
  providers: [
    TeachingScheduleService,
    TeachingScheduleController,
  ],
})
export class TeachingScheduleModule {}
