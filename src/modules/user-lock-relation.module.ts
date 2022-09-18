import { Module } from '@nestjs/common';
import { UserLockRelationService } from '../services/user-lock-relation.service';
import { UserLockRelationController } from '../controllers/user-lock-relation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLockRelation } from 'src/entities/user-lock-relation.entity';
import { Lock } from 'src/entities/lock.entity';
import { User } from 'src/entities/user.entity';
import { LockService } from 'src/services/lock.service';
import { UserService } from 'src/services/user.service';
import { WebsocketService } from 'src/services/websocket.service';

@Module({
  controllers: [UserLockRelationController],
  imports: [TypeOrmModule.forFeature([UserLockRelation, Lock, User])],
  providers: [
    UserLockRelationService,
    LockService,
    UserService,
    WebsocketService,
  ],
})
export class UserLockRelationModule {}
