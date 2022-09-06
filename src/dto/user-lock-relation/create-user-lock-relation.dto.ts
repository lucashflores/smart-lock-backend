import {
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
  lockName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsNumberString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(6)
  token?: string;
}
