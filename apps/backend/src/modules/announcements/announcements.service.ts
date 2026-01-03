import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseAnnouncement } from '../../models/course-announcement.model';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(CourseAnnouncement)
    private readonly caModel: typeof CourseAnnouncement
  ) {}

  async create(dto: {
    course_id: string;
    title: string;
    content: string;
    category?: string;
  }) {
    const created = await this.caModel.create({
      ...dto,
      status: 'DRAFT',
    } as any);
    return { id: created.id };
  }
  async update(dto: {
    id: string;
    title?: string;
    content?: string;
    category?: string;
  }) {
    await this.caModel.update(
      {
        title: dto.title,
        content: dto.content,
        category: dto.category,
      } as any,
      { where: { id: dto.id } }
    );
    return { ok: true };
  }
  async delete(dto: { id: string }) {
    await this.caModel.destroy({ where: { id: dto.id } });
    return { ok: true };
  }
  async publish(dto: { id: string }) {
    await this.caModel.update(
      {
        status: 'PUBLISHED',
        published_at: new Date(),
      } as any,
      { where: { id: dto.id } }
    );
    return { ok: true };
  }
  async getList(dto: {
    course_id?: string;
    teacher_id?: string;
    keyword?: string;
    page?: number;
    page_size?: number;
  }) {
    const page = Number(dto.page ?? 1);
    const page_size = Number(dto.page_size ?? 20);
    const offset = (page - 1) * page_size;
    const sequelize: any = (this.caModel as any).sequelize;
    if (dto.teacher_id || dto.keyword) {
      const where: string[] = [];
      const replacements: Record<string, unknown> = {};
      if (dto.teacher_id) {
        where.push('c.teacher_id = :teacher_id');
        replacements.teacher_id = dto.teacher_id;
      }
      if (dto.keyword) {
        where.push(
          '(a.title ILIKE :kw OR a.content ILIKE :kw)'
        );
        replacements.kw = `%${dto.keyword}%`;
      }
      if (dto.course_id) {
        where.push('a.course_id = :course_id');
        replacements.course_id = dto.course_id;
      }
      const whereSql = where.length
        ? `WHERE ${where.join(' AND ')}`
        : '';
      const [rows]: any = await sequelize.query(
        `SELECT a.id, a.course_id, a.title, a.content, a.category, a.status, a.published_at, a.created_at, a.updated_at,
                c.name AS course_name, c.academic_year, c.semester
         FROM course_announcements a
         JOIN courses c ON a.course_id = c.id
         ${whereSql}
         ORDER BY COALESCE(a.published_at, a.created_at) DESC
         LIMIT :limit OFFSET :offset`,
        {
          replacements: {
            ...replacements,
            limit: page_size,
            offset,
          },
        }
      );
      const [[{ count }]]: any = await sequelize.query(
        `SELECT COUNT(1) AS count FROM course_announcements a JOIN courses c ON a.course_id = c.id ${whereSql}`,
        { replacements }
      );
      return {
        data: rows,
        pagination: {
          page,
          page_size,
          total: Number(count),
          total_pages: Math.ceil(Number(count) / page_size),
        },
      };
    }
    const where: any = {};
    if (dto.course_id) where.course_id = dto.course_id;
    const { rows, count } =
      await this.caModel.findAndCountAll({
        where,
        offset,
        limit: page_size,
        order: [['updated_at', 'DESC']],
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
  async getStatistics(course_id: string) {
    const total = await this.caModel.count({
      where: { course_id } as any,
    });
    const published = await this.caModel.count({
      where: { course_id, status: 'PUBLISHED' } as any,
    });
    const draft = await this.caModel.count({
      where: { course_id, status: 'DRAFT' } as any,
    });
    return { total, published, draft };
  }
}
