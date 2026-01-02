import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GradeAudit } from '../../models/grade-audit.model';
import { Enrollment } from '../../models/enrollment.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class GradeAuditService {
  constructor(
    @InjectModel(GradeAudit)
    private readonly gaModel: typeof GradeAudit,
    @InjectModel(Enrollment)
    private readonly enrollModel: typeof Enrollment
  ) {}

  async create(
    dto: {
      enrollment_id: string;
      new_score?: number;
      new_grade?: string;
      reason?: string;
    },
    context?: Record<string, unknown>
  ) {
    const enroll = await this.enrollModel.findByPk(
      dto.enrollment_id
    );
    const created = await this.gaModel.create({
      enrollment_id: dto.enrollment_id,
      old_score: (enroll as any)?.score ?? null,
      old_grade: (enroll as any)?.grade ?? null,
      new_score: dto.new_score ?? null,
      new_grade: dto.new_grade ?? null,
      reason: dto.reason ?? null,
      status: 'PENDING',
    } as any);
    return { id: created.id, status: 'PENDING' };
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
      await this.gaModel.findAndCountAll({
        where: Sequelize.literal(
          `enrollment_id IN (SELECT id FROM enrollments WHERE course_id = '${params.course_id}')`
        ),
        offset,
        limit: page_size,
        order: [['created_at', 'DESC']],
      } as any);
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

  async review(
    dto: {
      id: string;
      action: 'APPROVE' | 'REJECT';
      notes?: string;
    },
    context?: Record<string, unknown>
  ) {
    const found = await this.gaModel.findByPk(dto.id);
    if (!found) return { ok: false } as any;
    const status =
      dto.action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const reviewed_by = (context as any)?.user?.id ?? null;
    await this.gaModel.update(
      {
        status,
        reviewed_by,
        reviewed_at: new Date(),
      } as any,
      { where: { id: dto.id } }
    );
    if (status === 'APPROVED') {
      await this.enrollModel.update(
        {
          score:
            found.new_score ??
            (found as any).old_score ??
            null,
          grade:
            found.new_grade ??
            (found as any).old_grade ??
            null,
          teacher_comment: dto.notes ?? null,
        } as any,
        { where: { id: found.enrollment_id } }
      );
    }
    return { ok: true, status };
  }
}
