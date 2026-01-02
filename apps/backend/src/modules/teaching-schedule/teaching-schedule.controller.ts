import { Injectable, Inject } from '@nestjs/common';
import { TeachingScheduleService } from './teaching-schedule.service';
import { validateDto } from '../../common/utils/validate';
import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsInt,
} from 'class-validator';

class GetScheduleDto {
  @IsUUID() teacher_id!: string;
}
class CheckConflictDto {
  @IsUUID() teacher_id!: string;
  @IsInt() day_of_week!: number;
}
class ApplyChangeDto {
  @IsUUID() course_id!: string;
  @IsOptional() @IsInt() old_day_of_week?: number;
  @IsInt() new_day_of_week!: number;
}

@Injectable()
export class TeachingScheduleController {
  constructor(
    @Inject(TeachingScheduleService)
    private readonly service: TeachingScheduleService
  ) {}
  async getSchedule(params: Record<string, unknown>) {
    const dto = validateDto(GetScheduleDto, params);
    return await this.service.getSchedule(dto);
  }
  async checkConflict(params: Record<string, unknown>) {
    const dto = validateDto(CheckConflictDto, params);
    return await this.service.checkConflict(dto);
  }
  async applyChange(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ApplyChangeDto, params);
    return await this.service.applyChange(dto, context);
  }
}
