import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CourseMaterial } from '../../models/course-material.model';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(CourseMaterial)
    private readonly cmModel: typeof CourseMaterial
  ) {}

  async getCourseMaterials(course_id: string) {
    const items = await this.cmModel.findAll({
      where: { course_id } as any,
      order: [['created_at', 'DESC']],
    });
    return { items } as any;
  }

  async upload(payload: {
    course_id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
    category?: string;
    description?: string;
    permissions?: string;
  }) {
    const created = await this.cmModel.create(
      payload as any
    );
    return { id: created.id };
  }

  async update(payload: {
    course_id: string;
    id: string;
    description?: string;
    permissions?: string;
    category?: string;
  }) {
    await this.cmModel.update(
      {
        description: payload.description,
        permissions: payload.permissions,
        category: payload.category,
      } as any,
      {
        where: {
          id: payload.id,
          course_id: payload.course_id,
        } as any,
      }
    );
    return { ok: true } as any;
  }

  async delete(payload: { course_id: string; id: string }) {
    await this.cmModel.destroy({
      where: {
        id: payload.id,
        course_id: payload.course_id,
      } as any,
    });
    return { ok: true } as any;
  }
}
