import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { decode, verify } from 'jsonwebtoken';
import { User } from 'src/entities/user.entity';
import { Lock } from 'src/entities/lock.entity';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user =
      request.params['user_email'] ||
      request.params['user_id'] ||
      request.params['userID'] ||
      request.query['userID'];
    let lockId = request.query['lockID'];
    const jwt = request.headers['authorization'];
    if (!jwt) throw new UnauthorizedException('Not Authorized');
    if (!jwt.includes('Bearer '))
      throw new UnauthorizedException('Not Authorized');
    const encodedToken = jwt.replace(/Bearer\s/, '');
    try {
      verify(encodedToken, process.env.SECRET, {
        complete: true,
      });
    } catch (err) {
      throw new UnauthorizedException('Not Authorized');
    }

    const decodedJwt = decode(encodedToken, {
      complete: true,
    });
    if (!decodedJwt) throw new UnauthorizedException('Not Authorized');
    const { payload, header } = decodedJwt;
    if (header?.typ !== 'JWT' || typeof payload === 'string')
      throw new UnauthorizedException('Not Authorized');
    const formattedPayload = payload as {
      user: Partial<User>;
    };
    let owner = false;
    if (lockId) {
      owner = formattedPayload.user['locks'].find(
        (lock: Lock) => lock.id === lockId,
      )['owner'];
    }
    request.user = payload.user;
    if (
      formattedPayload.user.email === user ||
      formattedPayload.user.id === user ||
      owner
    )
      return true;
    throw new UnauthorizedException('Not Authorized');
  }
}
