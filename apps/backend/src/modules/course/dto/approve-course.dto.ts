import {
  IsUUID,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class ApproveCourseDto {
  @IsUUID()
  id!: string;

  @IsIn(['APPROVE', 'REJECT'])
  action!: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  notes?: string;
}
