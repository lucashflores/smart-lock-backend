import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  lockID: string;
}
