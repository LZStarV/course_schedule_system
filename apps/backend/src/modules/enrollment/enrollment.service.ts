import { Injectable } from '@nestjs/common';
import {
  InjectModel,
  InjectConnection,
} from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Enrollment } from '../../models/enrollment.model';
import { redisClient } from '../../config/redis.config';
import { logger } from '../../common/logger';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment)
    private readonly enrollmentModel: typeof Enrollment,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  async add(params: {
    courseId: string;
    sectionId?: string;
  }) {
    logger.info({
      courseId: params.courseId,
      sectionId: params.sectionId,
    });
    const t = await this.sequelize.transaction();
    try {
      const created = await this.enrollmentModel.create(
        {
          course_id: params.courseId,
          student_id:
            '00000000-0000-0000-0000-000000000003',
          status: 'SELECTED',
        } as any,
        { transaction: t }
      );
      await t.commit();
      logger.info({ enrollmentId: created.id });
      const keys = await redisClient.keys('course:list:*');
      if (keys.length) await redisClient.del(...keys);
      return {
        enrollmentId: created.id,
        status: 'SELECTED',
      };
    } catch (e) {
      await t.rollback();
      logger.error({ error: (e as any)?.message });
      throw e;
    }
  }

  async listMy(
    params: {
      page?: number;
      page_size?: number;
      academic_year?: string;
      semester?: string;
    },
    context?: Record<string, unknown>
  ) {
    const page = Number(params.page ?? 1);
    const page_size = Number(params.page_size ?? 20);
    const offset = (page - 1) * page_size;
    const student_id = (context as any)?.user?.id ?? null;
    if (!student_id) {
      return {
        data: [],
        pagination: {
          page,
          page_size,
          total: 0,
          total_pages: 0,
        },
      };
    }
    const whereEnroll: any = { student_id } as any;
    if (params.academic_year)
      whereEnroll.academic_year = String(
        params.academic_year
      );
    if (params.semester)
      whereEnroll.semester = String(params.semester);
    const enrolls = await this.enrollmentModel.findAll({
      where: whereEnroll,
      attributes: ['course_id'],
    });
    const courseIds = Array.from(
      new Set(enrolls.map((e: any) => e.course_id))
    ).filter(Boolean);
    const { rows, count } = await (
      this.sequelize as any
    ).models.ClassSchedule.findAndCountAll({
      where: {
        course_id: courseIds.length ? courseIds : null,
      } as any,
      include: [
        {
          model: (this.sequelize as any).models.Course,
          attributes: ['name'],
        },
      ],
      offset,
      limit: page_size,
      order: [
        ['weekday', 'ASC'],
        ['start_time', 'ASC'],
      ],
    });
    const total = count ?? 0;
    const data = (rows ?? []).map((r: any) => ({
      course: { name: r.course?.name },
      weekday: r.weekday,
      start_time: r.start_time,
      end_time: r.end_time,
      location: r.location,
    }));
    return {
      data,
      pagination: {
        page,
        page_size,
        total,
        total_pages: Math.ceil(total / page_size),
      },
    };
  }

  async listMyGrades(
    params: {
      page?: number;
      page_size?: number;
      academic_year?: string;
      semester?: string;
    },
    context?: Record<string, unknown>
  ) {
    const page = Number(params.page ?? 1);
    const page_size = Number(params.page_size ?? 20);
    const offset = (page - 1) * page_size;
    const student_id = (context as any)?.user?.id ?? null;
    if (!student_id) {
      return {
        data: [],
        pagination: {
          page,
          page_size,
          total: 0,
          total_pages: 0,
        },
      };
    }
    const whereEnroll: any = { student_id } as any;
    if (params.academic_year)
      whereEnroll.academic_year = String(
        params.academic_year
      );
    if (params.semester)
      whereEnroll.semester = String(params.semester);
    const { rows, count } =
      await this.enrollmentModel.findAndCountAll({
        where: whereEnroll,
        offset,
        limit: page_size,
        order: [['updated_at', 'DESC']],
      });
    const courseIds = Array.from(
      new Set((rows ?? []).map((e: any) => e.course_id))
    ).filter(Boolean);
    const courses = await (
      this.sequelize as any
    ).models.Course.findAll({
      where: { id: courseIds.length ? courseIds : null },
    });
    const nameById = new Map<string, string>();
    for (const c of courses) nameById.set(c.id, c.name);
    const data = (rows ?? []).map((e: any) => ({
      course_name: nameById.get(e.course_id) ?? '',
      academic_year: e.academic_year,
      semester: e.semester,
      score: e.score,
      gpa_points: e.gpa_points,
      grade: e.grade,
    }));
    return {
      data,
      pagination: {
        page,
        page_size,
        total: count,
        total_pages: Math.ceil(count / page_size),
      },
    };
  }

  async listByCourse(params: {
    course_id: string;
    page?: number;
    page_size?: number;
  }) {
    const page = Number(params.page ?? 1);
    const page_size = Number(params.page_size ?? 20);
    const offset = (page - 1) * page_size;
    const { rows, count } =
      await this.enrollmentModel.findAndCountAll({
        where: { course_id: params.course_id } as any,
        offset,
        limit: page_size,
      });
    return {
      data: rows as any[],
      pagination: {
        page,
        page_size,
        total: count,
        total_pages: Math.ceil(count / page_size),
      },
    };
  }

  async updateScore(payload: {
    enrollment_id: string;
    score?: number;
    notes?: string;
  }) {
    // 提交审核占位：不直接写入 enrollments，返回 PENDING 状态
    logger.info({
      action: 'grade_update_pending',
      payload,
    });
    return { ok: true, status: 'PENDING' } as any;
  }
}
