import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { CourseService } from './course.service';
import { validateDto } from '../../common/utils/validate';
import { ListForStudentDto } from './dto/list-for-student.dto';
import { ListByTeacherDto } from './dto/list-by-teacher.dto';

@Injectable()
export class CourseController implements OnModuleInit {
  constructor(
    @Inject(RpcRegistry) private readonly registry: RpcRegistry,
    @Inject(CourseService) private readonly service: CourseService
  ) {}

  onModuleInit() {
    this.registry.register('Course.ListForStudent', async (params: Record<string, unknown>) => {
      validateDto(ListForStudentDto, params);
      return await this.service.listForStudent(params);
    });

    this.registry.register(
      'Course.ListByTeacher',
      async (params: Record<string, unknown>, context?: Record<string, unknown>) => {
        const dto = validateDto(ListByTeacherDto, params);
        return await this.service.listByTeacher(dto, context);
      }
    );
  }
}
