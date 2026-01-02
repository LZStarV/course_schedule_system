import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Course } from '../../models/course.model';
import { Department } from '../../models/department.model';
import { User } from '../../models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Course, Department, User]),
  ],
  providers: [CourseService, CourseController],
})
export class CourseModule {}
