import { IsMACAddress, IsNotEmpty, IsString } from 'class-validator';

export class CreateLockDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  websocket: string;

  @IsString()
  @IsNotEmpty()
  @IsMACAddress()
  macAddress: string;
}
