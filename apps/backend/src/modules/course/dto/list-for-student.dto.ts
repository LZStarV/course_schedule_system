import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';

export class ListForStudentDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsInt()
  credit?: number;

  @IsOptional()
  @IsBoolean()
  avoidConflict?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  page_size?: number;
}
