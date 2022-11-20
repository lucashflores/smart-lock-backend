import {
  ConflictException,
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
      name: createLockDto.name,
      websocket: createLockDto.websocket,
      commandHash: this.makeHash(15),
    };
    try {
      return await this.lockRepository.save(newLock);
    } catch (err) {
      throw new ConflictException('A lock with this name already exists');
    }
  }

  private makeHash(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async findByID(id: string) {
    const lock = await this.lockRepository.findOne({ where: { id } });
    if (!lock) throw new NotFoundException('Lock not found');
    return lock;
  }

  async findAllLockUsers(lockID: string) {
    const lock = await this.lockRepository.findOne({
      where: { id: lockID },
      relations: ['relations', 'relations.user'],
    });
    return lock.relations.map((relation) => relation.user);
  }

  async update(lockID: string, updateLockDto: UpdateLockDto) {
    const lock = await this.findByID(lockID);
    const updatedLock: Lock = {
      id: lock.id,
      websocket: updateLockDto.websocket || lock.websocket,
      name: updateLockDto.name || lock.name,
      commandHash: lock.commandHash,
    };
    try {
      await this.lockRepository.save(updatedLock);
    } catch (err) {
      throw new ConflictException('A lock with this name already exists');
    }
  }

  async sendUnlockEvent(lockId: string) {
    const lock = await this.findByID(lockId);
    await this.websocketService.sendUnlockEvent(lock.commandHash);
  }

  async unlock(lockID: string) {
    await this.sendUnlockEvent(lockID);
  }

  async remove(lockID: string) {
    await this.findByID(lockID);
    await this.lockRepository.delete({ id: lockID });
  }
}
