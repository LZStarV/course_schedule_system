import { Injectable, Inject } from '@nestjs/common';
import { CourseService } from './course.service';
import { validateDto } from '../../common/utils/validate';
import { ListForStudentDto } from './dto/list-for-student.dto';
import { ListByTeacherDto } from './dto/list-by-teacher.dto';

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
}
