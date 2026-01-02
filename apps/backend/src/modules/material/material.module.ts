import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { CourseMaterial } from '../../models/course-material.model';

@Module({
  imports: [SequelizeModule.forFeature([CourseMaterial])],
  providers: [MaterialService, MaterialController],
})
export class MaterialModule {}
