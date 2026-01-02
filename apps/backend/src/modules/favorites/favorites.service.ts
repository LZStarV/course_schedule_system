import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseFavorite } from '../../models/course-favorite.model';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(CourseFavorite)
    private readonly cfModel: typeof CourseFavorite
  ) {}

  async add(
    dto: { course_id: string; category?: string },
    context?: Record<string, unknown>
  ) {
    const user_id = (context as any)?.user?.id;
    await this.cfModel.create({
      user_id,
      course_id: dto.course_id,
      category: dto.category,
    } as any);
    return { ok: true };
  }
  async remove(
    dto: { course_id: string },
    context?: Record<string, unknown>
  ) {
    const user_id = (context as any)?.user?.id;
    await this.cfModel.destroy({
      where: { user_id, course_id: dto.course_id } as any,
    });
    return { ok: true };
  }
  async list(
    params: { page?: number; page_size?: number },
    context?: Record<string, unknown>
  ) {
    const user_id = (context as any)?.user?.id;
    const page = Number(params.page ?? 1);
    const page_size = Number(params.page_size ?? 20);
    const offset = (page - 1) * page_size;
    if (!user_id) {
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
    const { rows, count } =
      await this.cfModel.findAndCountAll({
        where: { user_id } as any,
        offset,
        limit: page_size,
        order: [['created_at', 'DESC']],
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
}
