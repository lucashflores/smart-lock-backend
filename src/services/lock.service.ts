import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLockDto } from '../dto/lock/create-lock.dto';
import { UpdateLockDto } from '../dto/lock/update-lock.dto';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lock } from 'src/entities/lock.entity';
import { UserLockRelationService } from './user-lock-relation.service';

@Injectable()
export class LockService {
  constructor(
    @InjectRepository(Lock)
    private readonly lockRepository: Repository<Lock>,
    @Inject(UserLockRelationService)
    private readonly userLockRelationService: UserLockRelationService,
  ) {}

  async create(createLockDto: CreateLockDto) {
    const newLock: Partial<Lock> = {
      macAddress: createLockDto.macAddress,
      name: createLockDto.name,
      websocket: createLockDto.websocket,
    };
    return await this.lockRepository.save(newLock);
  }

  findAll() {
    return `This action returns all lock`;
  }

  async findByName(name: string) {
    const lock = await this.lockRepository.findOne({ where: { name } });
    if (!lock) throw new NotFoundException('Lock not found');
    return lock;
  }

  async findByID(id: string) {
    const lock = await this.lockRepository.findOne({ where: { id } });
    if (!lock) throw new NotFoundException('Lock not found');
    return lock;
  }

  async update(lockName: string, updateLockDto: UpdateLockDto) {
    const lock = await this.findByName(lockName);
    const updatedLock: Lock = {
      id: lock.id,
      websocket: updateLockDto.websocket || lock.websocket,
      macAddress: updateLockDto.macAddress || lock.macAddress,
      name: updateLockDto.name || lock.name,
    };
    await this.lockRepository.save(updatedLock);
  }

  async sendLockEvent() {}

  async sendUnlockEvent() {}

  async unlock(lockName: string, userEmail: string) {
    await this.userLockRelationService.findRelation(userEmail, lockName);
    const lock = await this.findByName(lockName);
    await this.sendUnlockEvent();
    await new Promise((resolve) => setTimeout(resolve, 6000));
    await this.sendLockEvent();
  }

  async remove(lockName: string) {
    await this.findByName(lockName);
    await this.lockRepository.delete({ name: lockName });
  }
}
