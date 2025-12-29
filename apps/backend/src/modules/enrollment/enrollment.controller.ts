import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { EnrollmentService } from './enrollment.service';
import { validateDto } from '../../common/utils/validate';
import { EnrollmentAddDto } from './dto/enrollment-add.dto';
import { ListMyDto } from './dto/list-my.dto';

@Injectable()
export class EnrollmentController implements OnModuleInit {
  constructor(
    @Inject(RpcRegistry) private readonly registry: RpcRegistry,
    @Inject(EnrollmentService) private readonly service: EnrollmentService
  ) {}

  onModuleInit() {
    this.registry.register('Enrollment.Add', async (params: Record<string, unknown>) => {
      const dto = validateDto(EnrollmentAddDto, params);
      return await this.service.add({ courseId: dto.courseId, sectionId: dto.sectionId });
    });

    this.registry.register('Enrollment.ListMy', async (params: Record<string, unknown>) => {
      const dto = validateDto(ListMyDto, params);
      return await this.service.listMy({ page: dto.page, page_size: dto.page_size });
    });
  }
}
