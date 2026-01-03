import {
  IsOptional,
  IsNumber,
  IsString,
} from 'class-validator';

export class ListMyDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  page_size?: number;

  @IsOptional()
  @IsString()
  academic_year?: string;

  @IsOptional()
  @IsString()
  semester?: string;
}
