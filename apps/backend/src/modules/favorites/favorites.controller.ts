import { Injectable, Inject } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validateDto } from '../../common/utils/validate';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

class AddDto {
  @IsUUID() course_id!: string;
  @IsOptional() @IsString() category?: string;
}
class RemoveDto {
  @IsUUID() course_id!: string;
}
class ListDto {
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() page_size?: number;
}

@Injectable()
export class FavoritesController {
  constructor(
    @Inject(FavoritesService)
    private readonly service: FavoritesService
  ) {}

  async add(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(AddDto, params);
    return await this.service.add(dto, context);
  }
  async remove(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(RemoveDto, params);
    return await this.service.remove(dto, context);
  }
  async list(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(ListDto, params);
    return await this.service.list(dto, context);
  }
}
