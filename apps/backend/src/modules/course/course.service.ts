import { Injectable } from '@nestjs/common';
import { redisClient } from '../../config/redis.config';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Course } from '../../models/course.model';
import { Department } from '../../models/department.model';
import { User } from '../../models/user.model';
import { logger } from '../../common/logger';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course)
    private readonly courseModel: typeof Course,
    @InjectModel(Department)
    private readonly deptModel: typeof Department,
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async listForStudent(params: Record<string, unknown>) {
    const page = Number(params['page'] ?? 1);
    const page_size = Number(params['page_size'] ?? 20);
    const key = `course:list:${params['academicYear'] ?? ''}:${params['semester'] ?? ''}:${params['status'] ?? ''}:${page}:${page_size}`;
    const cached = await redisClient.get(key);
    if (cached) {
      logger.info({ cache: 'hit', key });
      return JSON.parse(cached);
    }
    logger.info({ cache: 'miss', key });
    const where: any = {};
    if (params['keyword']) {
      where.name = {
        [Op.iLike]: `%${String(params['keyword'])}%`,
      };
    }
    if (params['credit']) {
      where.credit = Number(params['credit']);
    }
    if (params['department_id']) {
      where.department_id = String(params['department_id']);
    }
    if (params['teacher_id']) {
      where.teacher_id = String(params['teacher_id']);
    }
    if (params['status']) {
      where.status = String(params['status']);
    }
    if (params['academic_year']) {
      where.academic_year = String(params['academic_year']);
    }
    if (params['semester']) {
      where.semester = String(params['semester']);
    }

    const offset = (page - 1) * page_size;
    const { rows, count } =
      await this.courseModel.findAndCountAll({
        where,
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'username'],
          },
        ],
        order: [['published_at', 'DESC']],
        offset,
        limit: page_size,
      });

    const data = rows.map((c: Course) => ({
      id: c.id,
      course_code: c.course_code,
      course_number: c.course_number ?? null,
      name: c.name,
      english_name: c.english_name ?? null,
      credit: Number(c.credit),
      credit_hours: c.credit_hours,
      course_type: c.course_type,
      department_id: c.department_id,
      teacher_id: c.teacher_id,
      academic_year: c.academic_year,
      semester: c.semester,
      capacity: c.capacity,
      min_quota: c.min_quota ?? 1,
      enrolled_count: c.enrolled_count,
      status: c.status,
      schedule: c.schedule ?? {
        weekly: [],
        specific_dates: [],
      },
      location_type: c.location_type,
      location_details: c.location_details ?? null,
      description: c.description ?? null,
      objectives: c.objectives ?? null,
      syllabus: c.syllabus ?? null,
      assessment_method: c.assessment_method ?? null,
      textbook_reference: c.textbook_reference ?? null,
      attachments: c.attachments ?? null,
      restrictions: c.restrictions ?? null,
      view_count: c.view_count ?? 0,
      favorite_count: c.favorite_count ?? 0,
      review_notes: c.review_notes ?? null,
      reviewed_at: c.reviewed_at?.toISOString?.() ?? null,
      reviewed_by: c.reviewed_by ?? null,
      published_at: c.published_at?.toISOString?.() ?? null,
      created_at:
        c.createdAt?.toISOString?.() ??
        new Date().toISOString(),
      updated_at:
        c.updatedAt?.toISOString?.() ??
        new Date().toISOString(),
    }));

    const result = {
      data,
      pagination: {
        page,
        page_size,
        total: count,
        total_pages: Math.ceil(count / page_size),
      },
    };
    logger.info({ page, page_size, total: count });
    await redisClient.set(
      key,
      JSON.stringify(result),
      'EX',
      300
    );
    return result;
  }

  async listByTeacher(
    params: {
      teacher_id: string;
      keyword?: string;
      credit?: number;
      status?: string[];
      academic_year?: string;
      semester?: string;
      page?: number;
      page_size?: number;
    },
    context?: Record<string, unknown>
  ) {
    const page = Number(params.page ?? 1);
    const page_size = Number(params.page_size ?? 20);
    const where: any = { teacher_id: params.teacher_id };
    if (params.keyword) {
      where.name = { [Op.iLike]: `%${params.keyword}%` };
    }
    if (params.credit) where.credit = Number(params.credit);
    if (params.status && params.status.length)
      where.status = params.status;
    if (params.academic_year)
      where.academic_year = params.academic_year;
    if (params.semester) where.semester = params.semester;

    // 权限：若用户为教师且查询他人 teacher_id，可后续限制；管理员不限制
    // 目前先放行，后续可根据 (context?.user?.role) 加强校验

    const offset = (page - 1) * page_size;
    const { rows, count } =
      await this.courseModel.findAndCountAll({
        where,
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['id', 'name'],
          },
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'username'],
          },
        ],
        order: [['updated_at', 'DESC']],
        offset,
        limit: page_size,
      });

    const data = rows.map((c: Course) => ({
      id: c.id,
      course_code: c.course_code,
      course_number: c.course_number ?? null,
      name: c.name,
      english_name: c.english_name ?? null,
      credit: Number(c.credit),
      credit_hours: c.credit_hours,
      course_type: c.course_type,
      department_id: c.department_id,
      teacher_id: c.teacher_id,
      academic_year: c.academic_year,
      semester: c.semester,
      capacity: c.capacity,
      min_quota: c.min_quota ?? 1,
      enrolled_count: c.enrolled_count,
      status: c.status,
      schedule: c.schedule ?? {
        weekly: [],
        specific_dates: [],
      },
      location_type: c.location_type,
      location_details: c.location_details ?? null,
      description: c.description ?? null,
      objectives: c.objectives ?? null,
      syllabus: c.syllabus ?? null,
      assessment_method: c.assessment_method ?? null,
      textbook_reference: c.textbook_reference ?? null,
      attachments: c.attachments ?? null,
      restrictions: c.restrictions ?? null,
      view_count: c.view_count ?? 0,
      favorite_count: c.favorite_count ?? 0,
      review_notes: c.review_notes ?? null,
      reviewed_at: c.reviewed_at?.toISOString?.() ?? null,
      reviewed_by: c.reviewed_by ?? null,
      published_at: c.published_at?.toISOString?.() ?? null,
      created_at:
        c.createdAt?.toISOString?.() ??
        new Date().toISOString(),
      updated_at:
        c.updatedAt?.toISOString?.() ??
        new Date().toISOString(),
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
}
