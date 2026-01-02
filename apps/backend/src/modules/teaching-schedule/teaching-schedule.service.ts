import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassSchedule } from '../../models/class-schedule.model';
import { ScheduleChangeRequest } from '../../models/schedule-change-request.model';

@Injectable()
export class TeachingScheduleService {
  constructor(
    @InjectModel(ClassSchedule)
    private readonly csModel: typeof ClassSchedule,
    @InjectModel(ScheduleChangeRequest)
    private readonly scrModel: typeof ScheduleChangeRequest
  ) {}

  async getSchedule(dto: { teacher_id: string }) {
    const items = await this.csModel.findAll({
      where: {} as any,
      order: [
        ['weekday', 'ASC'],
        ['start_time', 'ASC'],
      ],
    });
    // 简化：当前模型没有 teacher_id 字段，按课程聚合后端暂不区分教师；前端仅展示 weekly
    const weekly = items.map((x: any) => ({
      day_of_week: x.weekday,
      start_time: x.start_time,
      end_time: x.end_time,
      location: x.location,
    }));
    return { weekly };
  }

  async checkConflict(dto: {
    teacher_id: string;
    day_of_week: number;
  }) {
    // 仅时间维度：存在相同 weekday 的记录视为潜在冲突（简化）
    const count = await this.csModel.count({
      where: { weekday: dto.day_of_week } as any,
    });
    return { has_conflict: count > 0, conflicts: [] };
  }

  async applyChange(
    dto: {
      course_id: string;
      old_day_of_week?: number;
      new_day_of_week: number;
    },
    context?: Record<string, unknown>
  ) {
    const created = await this.scrModel.create({
      course_id: dto.course_id,
      old_day_of_week: dto.old_day_of_week ?? null,
      new_day_of_week: dto.new_day_of_week,
      status: 'PENDING',
    } as any);
    return { id: created.id, status: 'PENDING' };
  }
}
