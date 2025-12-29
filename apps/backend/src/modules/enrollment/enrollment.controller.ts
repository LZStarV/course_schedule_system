import { Injectable, OnModuleInit } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { EnrollmentService } from './enrollment.service';
import { validateDto } from '../../common/utils/validate';
import { EnrollmentAddDto } from './dto/enrollment-add.dto';

@Injectable()
export class EnrollmentController implements OnModuleInit {
  constructor(
    private readonly registry: RpcRegistry,
    private readonly service: EnrollmentService
  ) {}

  onModuleInit() {
    this.registry.register('Enrollment.Add', async (params: Record<string, unknown>) => {
      const dto = validateDto(EnrollmentAddDto, params);
      return await this.service.add({ courseId: dto.courseId, sectionId: dto.sectionId });
    });
  }
}
