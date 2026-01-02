import { Injectable, Inject } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { validateDto } from '../../common/utils/validate';
import { IsOptional, IsString } from 'class-validator';

class GetAllDto {
  @IsOptional()
  @IsString()
  category?: string;
}

class UpdateDto {
  @IsString()
  config_key!: string;
  // 使用 any，value 类型由业务决定
}

@Injectable()
export class SystemSettingsController {
  constructor(
    @Inject(SystemSettingsService)
    private readonly service: SystemSettingsService
  ) {}

  async getAll(params: Record<string, unknown>) {
    const dto = validateDto(GetAllDto, params);
    return await this.service.getAll((dto as any).category);
  }

  async update(params: Record<string, unknown>) {
    const dto = validateDto(UpdateDto, params);
    return await this.service.update(
      (dto as any).config_key,
      (params as any).config_value
    );
  }
}
