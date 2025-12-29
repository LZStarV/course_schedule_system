import { IsUUID, IsOptional } from 'class-validator';

export class EnrollmentAddDto {
  @IsUUID()
  courseId!: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;
}
