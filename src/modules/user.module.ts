import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserLockRelationService } from 'src/services/user-lock-relation.service';
import { UserLockRelation } from 'src/entities/user-lock-relation.entity';
import { LockService } from 'src/services/lock.service';
import { Lock } from 'src/entities/lock.entity';
import { WebsocketService } from 'src/services/websocket.service';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User, UserLockRelation, Lock])],
  providers: [
    UserService,
    UserLockRelationService,
    LockService,
    WebsocketService,
  ],
})
export class UserModule {}
