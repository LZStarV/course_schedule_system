import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username!: string;
  @IsString()
  email!: string;
  @IsString()
  role!: string;
  @IsString()
  status!: string;
  @IsString()
  password!: string;
}
