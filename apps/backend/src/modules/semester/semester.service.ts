import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Semester } from '../../models/semester.model';

@Injectable()
export class SemesterService {
  constructor(
    @InjectModel(Semester)
    private readonly semModel: typeof Semester
  ) {}

  async create(dto: {
    name: string;
    academic_year: string;
    start_date: string;
    end_date: string;
  }) {
    const created = await this.semModel.create({
      ...dto,
      status: 'DRAFT',
      is_current: false,
    } as any);
    return { id: created.id };
  }
  async activate(id: string) {
    // 硬结束旧学期并激活目标
    await this.semModel.update(
      { status: 'ENDED', is_current: false } as any,
      {
        where: {
          status: 'ACTIVE',
          is_current: true,
        } as any,
      }
    );
    await this.semModel.update(
      { status: 'ACTIVE', is_current: true } as any,
      { where: { id } as any }
    );
    return { ok: true };
  }
  async update(dto: { id: string; name?: string }) {
    await this.semModel.update({ name: dto.name } as any, {
      where: { id: dto.id },
    });
    return { ok: true };
  }
  async end(id: string) {
    await this.semModel.update(
      { status: 'ENDED', is_current: false } as any,
      { where: { id } }
    );
    return { ok: true };
  }
  async archive(id: string) {
    await this.semModel.update(
      { status: 'ARCHIVED', is_current: false } as any,
      { where: { id } }
    );
    return { ok: true };
  }
  async getList() {
    const rows = await this.semModel.findAll({
      order: [['start_date', 'DESC']],
    });
    return { data: rows as any[] };
  }
  async getDetail(id: string) {
    const row = await this.semModel.findByPk(id);
    return { data: row } as any;
  }
}
