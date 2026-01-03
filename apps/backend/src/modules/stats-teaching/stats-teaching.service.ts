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

  async details(context?: Record<string, unknown>) {
    const teacher_id = (context as any)?.user?.id ?? null;
    if (!teacher_id)
      return {
        status_distribution: {},
        top_courses: [],
        by_semester: [],
      };
    const courses = await this.courseModel.findAll({
      where: { teacher_id } as any,
      attributes: [
        'id',
        'status',
        'academic_year',
        'semester',
        'enrolled_count',
      ],
    });
    const status_distribution: Record<string, number> = {};
    for (const c of courses) {
      const k = String((c as any).status ?? 'UNKNOWN');
      status_distribution[k] =
        (status_distribution[k] ?? 0) + 1;
    }
    const top_courses = courses
      .map((c: any) => ({
        id: c.id,
        enrolled_count: Number(c.enrolled_count ?? 0),
      }))
      .sort((a, b) => b.enrolled_count - a.enrolled_count)
      .slice(0, 5);
    const byKey: Record<
      string,
      {
        academic_year: string;
        semester: string;
        courses: number;
        enrollments: number;
      }
    > = {};
    for (const c of courses) {
      const key = `${c.academic_year}#${c.semester}`;
      const rec = byKey[key] || {
        academic_year: String(c.academic_year ?? ''),
        semester: String(c.semester ?? ''),
        courses: 0,
        enrollments: 0,
      };
      rec.courses += 1;
      rec.enrollments += Number(
        (c as any).enrolled_count ?? 0
      );
      byKey[key] = rec;
    }
    const by_semester = Object.values(byKey);
    return {
      status_distribution,
      top_courses,
      by_semester,
    };
  }
}
