import { Injectable, OnModuleInit } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { CourseService } from './course.service';
import { validateDto } from '../../common/utils/validate';
import { ListForStudentDto } from './dto/list-for-student.dto';

@Injectable()
export class CourseController implements OnModuleInit {
  constructor(
    private readonly registry: RpcRegistry,
    private readonly service: CourseService
  ) {}

  onModuleInit() {
    this.registry.register('Course.ListForStudent', async (params: Record<string, unknown>) => {
      validateDto(ListForStudentDto, params);
      return await this.service.listForStudent(params);
    });
  }
}
