import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { CreateUserLockRelationDto } from './create-user-lock-relation.dto';

export class UpdateUserLockRelationDto extends PartialType(
  CreateUserLockRelationDto,
) {
  @IsString()
  @IsNotEmpty()
  lockID: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  userID: string;

  @IsBoolean()
  @IsEmail()
  @IsNotEmpty()
  owner: boolean;
}
