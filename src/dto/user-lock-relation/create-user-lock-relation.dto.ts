import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsNumberString,
  isNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserLockRelationDto {
  @IsString()
  @IsNotEmpty()
  lockID: string;

  @IsString()
  @IsNotEmpty()
  userID: string;

  @IsBoolean()
  @IsOptional()
  owner: boolean;
}
