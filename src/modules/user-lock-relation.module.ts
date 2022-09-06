import { Module } from '@nestjs/common';
import { UserLockRelationService } from '../services/user-lock-relation.service';
import { UserLockRelationController } from '../controllers/user-lock-relation.controller';
import { UserModule } from './user.module';
import { LockModule } from './lock.module';

@Module({
  controllers: [UserLockRelationController],
  imports: [UserModule, LockModule],
  providers: [UserLockRelationService],
})
export class UserLockRelationModule {}
