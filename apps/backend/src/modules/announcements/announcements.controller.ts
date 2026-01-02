import { Injectable, Inject } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { validateDto } from '../../common/utils/validate';
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';

class CreateDto {
  @IsUUID() course_id!: string;
  @IsString() title!: string;
  @IsString() content!: string;
  @IsOptional() @IsString() category?: string;
}
class UpdateDto {
  @IsUUID() id!: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() category?: string;
}
class DeleteDto {
  @IsUUID() id!: string;
}
class PublishDto {
  @IsUUID() id!: string;
}
class ListDto {
  @IsUUID() course_id!: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() page_size?: number;
}

@Injectable()
export class AnnouncementsController {
  constructor(
    @Inject(AnnouncementsService)
    private readonly service: AnnouncementsService
  ) {}
  async create(params: Record<string, unknown>) {
    const dto = validateDto(CreateDto, params);
    return await this.service.create(dto);
  }
  async update(params: Record<string, unknown>) {
    const dto = validateDto(UpdateDto, params);
    return await this.service.update(dto);
  }
  async delete(params: Record<string, unknown>) {
    const dto = validateDto(DeleteDto, params);
    return await this.service.delete(dto);
  }
  async publish(params: Record<string, unknown>) {
    const dto = validateDto(PublishDto, params);
    return await this.service.publish(dto);
  }
  async getList(params: Record<string, unknown>) {
    const dto = validateDto(ListDto, params);
    return await this.service.getList(dto);
  }
  async getStatistics(params: Record<string, unknown>) {
    const course_id = String(
      (params as any)?.course_id ?? ''
    );
    return await this.service.getStatistics(course_id);
  }
}
