import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserLockRelationDto } from '../dto/user-lock-relation/create-user-lock-relation.dto';
import { UpdateUserLockRelationDto } from '../dto/user-lock-relation/update-user-lock-relation.dto';
import { UserLockRelation } from 'src/entities/user-lock-relation.entity';
import { UserService } from './user.service';
import { LockService } from './lock.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserLockRelationService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(LockService)
    private readonly lockService: LockService,
    @InjectRepository(UserLockRelation)
    private readonly userLockRelationRepository: Repository<UserLockRelation>,
  ) {}
  async create(createUserLockRelationDto: CreateUserLockRelationDto) {
    const user = await this.userService.findByEmail(
      createUserLockRelationDto.userEmail,
    );
    const lock = await this.lockService.findByName(
      createUserLockRelationDto.lockName,
    );
    const relation: UserLockRelation = {
      lockID: lock.id,
      userID: user.id,
      token: createUserLockRelationDto.token || '',
    };
  }

  async findAllUserLocks(userEmail: string) {
    const user = await this.userService.findByEmail(userEmail);
    const allUserLockRelations = await this.userLockRelationRepository.find({
      where: {
        userID: user.id,
      },
    });
    const locks = [];
    allUserLockRelations.forEach((relation) => {
      locks.push(this.lockService.findByID(relation.lockID));
    });
    await Promise.all(locks);
    return locks;
  }

  async findRelation(userEmail: string, lockName: string) {
    const user = await this.userService.findByEmail(userEmail);
    const lock = await this.lockService.findByName(lockName);
    const userLockRelation = await this.userLockRelationRepository.findOne({
      where: {
        userID: user.id,
        lockID: lock.id,
      },
    });
    if (!userLockRelation)
      throw new NotFoundException('User and Lock does not have a relation');
    return userLockRelation;
  }

  async update(updateUserLockRelationDto: UpdateUserLockRelationDto) {
    const relation = await this.findRelation(
      updateUserLockRelationDto.userEmail,
      updateUserLockRelationDto.lockName,
    );
    const updatedRelation: UserLockRelation = {
      userID: relation.userID,
      lockID: relation.lockID,
      token: updateUserLockRelationDto.token,
    };
    await this.userLockRelationRepository.save(updatedRelation);
  }

  async remove(userEmail: string, lockName: string) {
    const relation = await this.findRelation(userEmail, lockName);
    await this.userLockRelationRepository.delete(relation);
  }
}
