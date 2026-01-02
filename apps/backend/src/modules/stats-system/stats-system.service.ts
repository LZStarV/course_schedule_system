import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';
import { Department } from '../../models/department.model';

@Injectable()
export class StatsSystemService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
    @InjectModel(Enrollment)
    private readonly enrollModel: typeof Enrollment,
    @InjectModel(Department)
    private readonly deptModel: typeof Department
  ) {}
  async get() {
    const users = await this.userModel.count();
    const courses = await this.courseModel.count();
    const enrollments = await this.enrollModel.count();
    const departments = await this.deptModel.count();
    return { users, courses, enrollments, departments };
  }
}
