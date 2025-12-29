import { IsString } from 'class-validator';

export class SetSelectTimeDto {
  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;
}
