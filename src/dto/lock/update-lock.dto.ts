import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateLockDto } from './create-lock.dto';

export class UpdateLockDto extends PartialType(CreateLockDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  websocket?: string;

  @IsString()
  @IsOptional()
  macAddress?: string;
}
