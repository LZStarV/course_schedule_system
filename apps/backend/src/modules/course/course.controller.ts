import { Injectable, Inject } from '@nestjs/common';
import { CourseService } from './course.service';
import { validateDto } from '../../common/utils/validate';
import { ListForStudentDto } from './dto/list-for-student.dto';
import { ListByTeacherDto } from './dto/list-by-teacher.dto';
import { ApproveCourseDto } from './dto/approve-course.dto';

@Injectable()
export class CourseController {
  constructor(
    @Inject(CourseService)
    private readonly service: CourseService
  ) {}

  async listForStudent(params: Record<string, unknown>) {
    validateDto(ListForStudentDto, params);
    return await this.service.listForStudent(params);
  }

  async listByTeacher(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ListByTeacherDto, params);
    return await this.service.listByTeacher(dto, context);
  }

  async approve(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ApproveCourseDto, params);
    return await this.service.approve(dto, context);
  }
}
