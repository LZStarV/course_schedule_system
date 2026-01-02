import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { Semester } from '../../models/semester.model';

@Module({
  imports: [SequelizeModule.forFeature([Semester])],
  providers: [SemesterService, SemesterController],
})
export class SemesterModule {}
