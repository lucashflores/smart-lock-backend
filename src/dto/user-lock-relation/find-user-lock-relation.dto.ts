import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FindUserLockRelationDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  lockID: string;
}
