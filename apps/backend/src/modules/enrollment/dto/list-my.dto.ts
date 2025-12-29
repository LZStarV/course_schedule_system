import { IsOptional, IsNumber } from 'class-validator';

export class ListMyDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  page_size?: number;
}
