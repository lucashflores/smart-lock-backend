import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateUserLockRelationDto } from './create-user-lock-relation.dto';

export class UpdateUserLockRelationDto extends PartialType(
  CreateUserLockRelationDto,
) {
  @IsString()
  @IsNotEmpty()
  lockName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(6)
  @MaxLength(6)
  token: string;
}
