import { Injectable, Inject } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { validateDto } from '../../common/utils/validate';
import { EnrollmentAddDto } from './dto/enrollment-add.dto';
import { ListMyDto } from './dto/list-my.dto';
import {
  IsUUID,
  IsOptional,
  IsNumber,
} from 'class-validator';

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

class UpdateScoreDto {
  @IsUUID()
  enrollment_id!: string;
  @IsOptional()
  @IsNumber()
  score?: number;
  @IsOptional()
  notes?: string;
}

import { IsString } from 'class-validator';

class ListMyGradesDto {
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() page_size?: number;
  @IsOptional() @IsString() academic_year?: string;
  @IsOptional() @IsString() semester?: string;
}

@Injectable()
export class EnrollmentController {
  constructor(
    @Inject(EnrollmentService)
    private readonly service: EnrollmentService
  ) {}

  async add(params: Record<string, unknown>) {
    const dto = validateDto(EnrollmentAddDto, params);
    return await this.service.add({
      courseId: dto.courseId,
      sectionId: dto.sectionId,
    });
  }

  async listMy(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ListMyDto, params);
    return await this.service.listMy(
      {
        page: dto.page,
        page_size: dto.page_size,
        academic_year: (dto as any).academic_year,
        semester: (dto as any).semester,
      },
      context
    );
  }

  async listByCourse(params: Record<string, unknown>) {
    const dto = validateDto(ListByCourseDto, params);
    return await this.service.listByCourse({
      course_id: (dto as any).course_id,
      page: (dto as any).page,
      page_size: (dto as any).page_size,
    });
  }

  async updateScore(params: Record<string, unknown>) {
    const dto = validateDto(UpdateScoreDto, params);
    return await this.service.updateScore({
      enrollment_id: (dto as any).enrollment_id,
      score: (dto as any).score,
      notes: (dto as any).notes,
    });
  }

  async listMyGrades(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ListMyGradesDto, params);
    return await this.service.listMyGrades(
      {
        page: (dto as any).page,
        page_size: (dto as any).page_size,
        academic_year: (dto as any).academic_year,
        semester: (dto as any).semester,
      },
      context
    );
  }
}
