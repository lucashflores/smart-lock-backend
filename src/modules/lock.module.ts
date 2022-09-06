import { Module } from '@nestjs/common';
import { LockService } from '../services/lock.service';
import { LockController } from '../controllers/lock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [LockController],
  imports: [TypeOrmModule.forFeature([Lock])],
  providers: [LockService],
})
export class LockModule {}
