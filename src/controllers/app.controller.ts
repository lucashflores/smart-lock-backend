import { Body, Controller, Get, Header, Post, Headers } from '@nestjs/common';
import { AuthDTO } from 'src/dto/app/auth.dto';
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
}
