import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';

@Injectable()
export class StatsTeachingService {
  constructor(
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
    @InjectModel(Enrollment)
    private readonly enrollModel: typeof Enrollment
  ) {}
  async get(context?: Record<string, unknown>) {
    const teacher_id = (context as any)?.user?.id ?? null;
    if (!teacher_id) return { courses: 0, enrollments: 0 };
    const courses = await this.courseModel.count({
      where: { teacher_id } as any,
    });
    const [rows]: any =
      await this.enrollModel.sequelize!.query(
        `SELECT COUNT(*) AS c FROM enrollments WHERE course_id IN (SELECT id FROM courses WHERE teacher_id = :tid)`,
        { replacements: { tid: teacher_id } }
      );
    const enrollments = Number(rows?.[0]?.c ?? 0);
    return { courses, enrollments };
  }
}
