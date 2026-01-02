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
    course_id: string;
    page?: number;
    page_size?: number;
  }) {
    const page = Number(dto.page ?? 1);
    const page_size = Number(dto.page_size ?? 20);
    const offset = (page - 1) * page_size;
    const { rows, count } =
      await this.caModel.findAndCountAll({
        where: { course_id: dto.course_id } as any,
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
