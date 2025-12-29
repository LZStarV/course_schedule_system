import { IsOptional, IsBoolean } from 'class-validator';

export class RefreshPermissionsDto {
  @IsOptional()
  @IsBoolean()
  force?: boolean;
}
