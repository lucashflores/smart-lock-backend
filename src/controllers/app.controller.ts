import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AuthDTO } from 'src/dto/app/auth.dto';
import { InviteUserDTO } from 'src/dto/app/invite.dto';
import { OwnerGuard } from 'src/guards/owner.guard';
import { AppService } from '../services/app.service';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  health() {
    return { status: 'OK', description: 'Server Running' };
  }

  @Post('/authenticate')
  async authenticate(@Body() authDTO: AuthDTO) {
    return {
      status: 'OK',
      token: await this.appService.authenticate(authDTO),
    };
  }

  @Post('/verify')
  async verifyToken(@Headers('Authorization') token: string) {
    return {
      status: 'OK',
      data: await this.appService.verifyToken(token),
    };
  }

  @Post('/refresh')
  async refreshToken(@Headers('Authorization') token: string) {
    return {
      status: 'OK',
      data: await this.appService.refreshToken(token),
    };
  }

  @UseGuards(OwnerGuard)
  @Post('/invite')
  async inviteUser(@Body() inviteUserDTO: InviteUserDTO) {
    await this.appService.inviteUser(inviteUserDTO);
    return {
      status: 'OK',
      message: 'Sucessfully invited user',
    };
  }
}
