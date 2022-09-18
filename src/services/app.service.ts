import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthDTO } from 'src/dto/app/auth.dto';
import { WebSocketServer } from 'ws';
import { UserService } from './user.service';

@Injectable()
export class AppService {
  private webSocketServer;
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async authenticate(authDTO: AuthDTO) {
    const user = await this.userService.findByEmail(authDTO.email);
    const isPasswordCorrect = await compare(authDTO.password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('Wrong password');
    return true;
  }
}
