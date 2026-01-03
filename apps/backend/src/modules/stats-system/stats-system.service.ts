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

  async details() {
    const depts = await this.deptModel.findAll({
      attributes: ['id', 'name'],
    });
    const courses_by_department: Array<{
      department_id: string;
      department_name: string;
      count: number;
    }> = [];
    for (const d of depts) {
      const count = await this.courseModel.count({
        where: { department_id: d.id } as any,
      });
      courses_by_department.push({
        department_id: d.id,
        department_name: d.name,
        count,
      });
    }
    const coursesAll = await this.courseModel.findAll({
      attributes: [
        'status',
        'academic_year',
        'semester',
        'enrolled_count',
      ],
    });
    const status_distribution: Record<string, number> = {};
    for (const c of coursesAll) {
      const k = String((c as any).status ?? 'UNKNOWN');
      status_distribution[k] =
        (status_distribution[k] ?? 0) + 1;
    }
    const byKeyCourses: Record<
      string,
      {
        academic_year: string;
        semester: string;
        courses: number;
        enrollments: number;
      }
    > = {};
    for (const c of coursesAll) {
      const key = `${(c as any).academic_year}#${(c as any).semester}`;
      const rec = byKeyCourses[key] || {
        academic_year: String(
          (c as any).academic_year ?? ''
        ),
        semester: String((c as any).semester ?? ''),
        courses: 0,
        enrollments: 0,
      };
      rec.courses += 1;
      rec.enrollments += Number(
        (c as any).enrolled_count ?? 0
      );
      byKeyCourses[key] = rec;
    }
    const courses_by_semester = Object.values(byKeyCourses);
    const enrollAll = await this.enrollModel.findAll({
      attributes: ['academic_year', 'semester'],
    });
    const byKeyEnroll: Record<
      string,
      {
        academic_year: string;
        semester: string;
        count: number;
      }
    > = {};
    for (const e of enrollAll) {
      const key = `${(e as any).academic_year}#${(e as any).semester}`;
      const rec = byKeyEnroll[key] || {
        academic_year: String(
          (e as any).academic_year ?? ''
        ),
        semester: String((e as any).semester ?? ''),
        count: 0,
      };
      rec.count += 1;
      byKeyEnroll[key] = rec;
    }
    const enrollments_by_semester =
      Object.values(byKeyEnroll);
    return {
      courses_by_department,
      status_distribution,
      courses_by_semester,
      enrollments_by_semester,
    };
  }
}
