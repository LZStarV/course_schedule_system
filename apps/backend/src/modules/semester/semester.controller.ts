import { Injectable, Inject } from '@nestjs/common';
import { SemesterService } from './semester.service';
import { validateDto } from '../../common/utils/validate';
import {
  IsUUID,
  IsOptional,
  IsString,
} from 'class-validator';

class CreateDto {
  @IsString() name!: string;
  @IsString() academic_year!: string;
  @IsString() start_date!: string;
  @IsString() end_date!: string;
}
class ActivateDto {
  @IsUUID() id!: string;
}
class UpdateDto {
  @IsUUID() id!: string;
  @IsOptional() @IsString() name?: string;
}
class EndDto {
  @IsUUID() id!: string;
}
class ArchiveDto {
  @IsUUID() id!: string;
}

@Injectable()
export class SemesterController {
  constructor(
    @Inject(SemesterService)
    private readonly service: SemesterService
  ) {}
  async create(params: Record<string, unknown>) {
    const dto = validateDto(CreateDto, params);
    return await this.service.create(dto);
  }
  async activate(params: Record<string, unknown>) {
    const dto = validateDto(ActivateDto, params);
    return await this.service.activate(dto.id);
  }
  async update(params: Record<string, unknown>) {
    const dto = validateDto(UpdateDto, params);
    return await this.service.update(dto);
  }
  async end(params: Record<string, unknown>) {
    const dto = validateDto(EndDto, params);
    return await this.service.end(dto.id);
  }
  async archive(params: Record<string, unknown>) {
    const dto = validateDto(ArchiveDto, params);
    return await this.service.archive(dto.id);
  }
  async getList() {
    return await this.service.getList();
  }
  async getDetail(params: Record<string, unknown>) {
    const id = String((params as any)?.id ?? '');
    return await this.service.getDetail(id);
  }
}
