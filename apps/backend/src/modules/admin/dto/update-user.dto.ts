import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  id!: string;
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  role?: string;
  @IsOptional()
  @IsString()
  status?: string;
  @IsOptional()
  @IsString()
  password?: string;
}
