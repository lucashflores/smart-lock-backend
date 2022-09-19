import { Body, Controller, Get, Post } from '@nestjs/common';
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
      authenticated: await this.appService.authenticate(authDTO),
    };
  }
}
