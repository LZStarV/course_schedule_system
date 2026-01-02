import { Injectable, Inject } from '@nestjs/common';
import { MaterialService } from './material.service';
import { validateDto } from '../../common/utils/validate';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsInt,
} from 'class-validator';

class GetCourseMaterialsDto {
  @IsUUID()
  course_id!: string;
}

class UploadMaterialDto {
  @IsUUID()
  course_id!: string;
  @IsString()
  file_name!: string;
  @IsString()
  file_url!: string;
  @IsString()
  file_type!: string;
  @IsInt()
  file_size!: number;
  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  permissions?: string;
}

class UpdateMaterialDto {
  @IsUUID()
  course_id!: string;
  @IsString()
  id!: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsString()
  permissions?: string;
  @IsOptional()
  @IsString()
  category?: string;
}

class DeleteMaterialDto {
  @IsUUID()
  course_id!: string;
  @IsString()
  id!: string;
}

@Injectable()
export class MaterialController {
  constructor(
    @Inject(MaterialService)
    private readonly service: MaterialService
  ) {}

  async getCourseMaterials(
    params: Record<string, unknown>
  ) {
    const dto = validateDto(GetCourseMaterialsDto, params);
    return await this.service.getCourseMaterials(
      (dto as any).course_id
    );
  }

  async upload(params: Record<string, unknown>) {
    const dto = validateDto(UploadMaterialDto, params);
    return await this.service.upload(dto as any);
  }

  async update(params: Record<string, unknown>) {
    const dto = validateDto(UpdateMaterialDto, params);
    return await this.service.update(dto as any);
  }

  async delete(params: Record<string, unknown>) {
    const dto = validateDto(DeleteMaterialDto, params);
    return await this.service.delete(dto as any);
  }
}
