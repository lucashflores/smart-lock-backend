import { Module } from '@nestjs/common';
import { LockService } from '../services/lock.service';
import { LockController } from '../controllers/lock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLockRelationService } from 'src/services/user-lock-relation.service';
import { UserLockRelation } from 'src/entities/user-lock-relation.entity';
import { Repository } from 'typeorm';
import { Lock } from 'src/entities/lock.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { WebsocketService } from 'src/services/websocket.service';

@Module({
  controllers: [LockController],
  imports: [TypeOrmModule.forFeature([Lock, UserLockRelation, User])],
  providers: [
    LockService,
    UserLockRelationService,
    UserService,
    WebsocketService,
  ],
})
export class LockModule {}
