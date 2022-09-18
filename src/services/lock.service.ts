import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLockDto } from '../dto/lock/create-lock.dto';
import { UpdateLockDto } from '../dto/lock/update-lock.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lock } from 'src/entities/lock.entity';
import { UserLockRelationService } from './user-lock-relation.service';
import { WebsocketService } from './websocket.service';

@Injectable()
export class LockService {
  constructor(
    @InjectRepository(Lock)
    private readonly lockRepository: Repository<Lock>,
    @Inject(forwardRef(() => UserLockRelationService))
    private readonly userLockRelationService: UserLockRelationService,
    @Inject(WebsocketService)
    private readonly websocketService: WebsocketService,
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

  async findByID(id: string) {
    const lock = await this.lockRepository.findOne({ where: { id } });
    if (!lock) throw new NotFoundException('Lock not found');
    return lock;
  }

  async update(lockID: string, updateLockDto: UpdateLockDto) {
    const lock = await this.findByID(lockID);
    const updatedLock: Lock = {
      id: lock.id,
      websocket: updateLockDto.websocket || lock.websocket,
      macAddress: updateLockDto.macAddress || lock.macAddress,
      name: updateLockDto.name || lock.name,
    };
    await this.lockRepository.save(updatedLock);
  }

  async sendLockEvent() {
    await this.websocketService.sendEvent('lock');
  }

  async sendUnlockEvent() {
    await this.websocketService.sendEvent('unlock');
  }

  async unlock(lockID: string, userEmail: string) {
    await this.userLockRelationService.findRelation(userEmail, lockID);
    const lock = await this.findByID(lockID);
    await this.sendUnlockEvent();
    await new Promise((resolve) => setTimeout(resolve, 6000));
    await this.sendLockEvent();
  }

  async remove(lockID: string) {
    await this.findByID(lockID);
    await this.userLockRelationService.removeAllLockRelations(lockID);
    await this.lockRepository.delete({ id: lockID });
  }
}
