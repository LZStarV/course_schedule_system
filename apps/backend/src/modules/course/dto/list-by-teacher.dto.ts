import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class ListByTeacherDto {
  @IsString()
  teacher_id!: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  credit?: number;

  @IsOptional()
  @IsArray()
  status?: string[];

  @IsOptional()
  @IsString()
  academic_year?: string;

  @IsOptional()
  @IsString()
  semester?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  page_size?: number;
}
