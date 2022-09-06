import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsEmail,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString({ message: 'name must be a string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'password must be a string' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'password too weak',
  })
  @IsOptional()
  password?: string;

  @IsString({ message: 'fingerprint must be a string' })
  @IsOptional()
  fingerprint?: string;

  @IsString({ message: 'face must be a string' })
  @IsOptional()
  face?: string;
}
