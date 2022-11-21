import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthDTO } from 'src/dto/app/auth.dto';
import { WebSocketServer } from 'ws';
import { UserService } from './user.service';
import { UserLockRelationService } from './user-lock-relation.service';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'jsonwebtoken';
import { InviteUserDTO } from 'src/dto/app/invite.dto';

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
    const locks = await this.userService.findAllUserLocks(user.id);
    user['locks'] = locks;
    delete user.password;
    const accessToken = this.jwtService.sign(
      { user },
      {
        expiresIn: +process.env.JWT_EXP_H,
      },
    );
    return accessToken;
  }

  async verifyToken(token: string) {
    try {
      const verifiedToken = verify(token, process.env.SECRET, {
        complete: true,
      });
      if (typeof verifiedToken.payload === 'string') return false;
      return verifiedToken.payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.verifyToken(token);
      const locks = await this.userService.findAllUserLocks(payload['user'].id);
      payload['user']['locks'] = locks;
      delete payload['user'].password;
      const accessToken = this.jwtService.sign(
        { user: payload['user'] },
        {
          expiresIn: +process.env.JWT_EXP_H,
        },
      );
      return accessToken;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async inviteUser(inviteUserDTO: InviteUserDTO) {
    const user = await this.userService.findByEmail(inviteUserDTO.email);
    await this.userLockRelationService.create({
      userID: user.id,
      lockID: inviteUserDTO.lockID,
      owner: false,
    });
  }
}
