import {
  IsString,
  IsUUID,
  IsObject,
  IsOptional,
} from 'class-validator';

export class RpcRequestDto {
  @IsString()
  id!: string;

  @IsString()
  method!: string;

  @IsObject()
  params!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  meta?: { version?: string };
}
