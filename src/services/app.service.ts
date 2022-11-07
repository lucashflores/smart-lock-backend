import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthDTO } from 'src/dto/app/auth.dto';
import { WebSocketServer } from 'ws';
import { UserService } from './user.service';
import { UserLockRelationService } from './user-lock-relation.service';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AppService {
  private webSocketServer;
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(UserLockRelationService)
    private readonly userLockRelationService: UserLockRelationService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async authenticate(authDTO: AuthDTO) {
    const user = await this.userService.findByEmail(authDTO.email);
    const isPasswordCorrect = await compare(authDTO.password, user.password);
    if (!isPasswordCorrect) throw new UnauthorizedException('Wrong password');
    const locks = await this.userLockRelationService.findAllUserLocks(
      authDTO.email,
    );
    user['locks'] = locks;
    delete user.password;
    const accessToken = this.jwtService.sign(user, {
      expiresIn: process.env.JWT_EXP_H,
    });
    return accessToken;
  }

  async verifyToken(token: string) {
    try {
      const verifiedToken = verify(token, process.env.JWT_SECRET, {
        complete: true,
      });
      if (typeof verifiedToken.payload === 'string') return false;
      return verifiedToken.payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
