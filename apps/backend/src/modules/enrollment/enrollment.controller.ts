import { Injectable, Inject } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { validateDto } from '../../common/utils/validate';
import { EnrollmentAddDto } from './dto/enrollment-add.dto';
import { ListMyDto } from './dto/list-my.dto';

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

  async listMy(params: Record<string, unknown>) {
    const dto = validateDto(ListMyDto, params);
    return await this.service.listMy({
      page: dto.page,
      page_size: dto.page_size,
    });
  }
}
