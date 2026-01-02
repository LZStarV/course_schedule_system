import { Injectable, Inject } from '@nestjs/common';
import { GradeAuditService } from './grade-audit.service';
import { validateDto } from '../../common/utils/validate';
import {
  IsUUID,
  IsOptional,
  IsNumber,
  IsString,
  IsIn,
} from 'class-validator';

class CreateDto {
  @IsUUID()
  enrollment_id!: string;
  @IsOptional()
  @IsNumber()
  new_score?: number;
  @IsOptional()
  @IsString()
  new_grade?: string;
  @IsOptional()
  @IsString()
  reason?: string;
}

class ListByCourseDto {
  @IsUUID()
  course_id!: string;
  @IsOptional()
  @IsNumber()
  page?: number;
  @IsOptional()
  @IsNumber()
  page_size?: number;
}

class ReviewDto {
  @IsUUID()
  id!: string;
  @IsIn(['APPROVE', 'REJECT'])
  action!: 'APPROVE' | 'REJECT';
  @IsOptional()
  @IsString()
  notes?: string;
}

@Injectable()
export class GradeAuditController {
  constructor(
    @Inject(GradeAuditService)
    private readonly service: GradeAuditService
  ) {}

  async create(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(CreateDto, params);
    return await this.service.create(dto, context);
  }

  async listByCourse(params: Record<string, unknown>) {
    const dto = validateDto(ListByCourseDto, params);
    return await this.service.listByCourse(dto);
  }

  async review(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ReviewDto, params);
    return await this.service.review(dto, context);
  }
}
