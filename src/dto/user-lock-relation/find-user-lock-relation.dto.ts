import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class FindUserLockRelationDTO {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  userID: string;

  @IsString()
  @IsNotEmpty()
  lockID: string;
}
