import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserLockRelationDto } from '../dto/user-lock-relation/create-user-lock-relation.dto';
import { UpdateUserLockRelationDto } from '../dto/user-lock-relation/update-user-lock-relation.dto';
import { UserLockRelation } from 'src/entities/user-lock-relation.entity';
import { UserService } from './user.service';
import { LockService } from './lock.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserLockRelationDTO } from 'src/dto/user-lock-relation/find-user-lock-relation.dto';
import { Lock } from '../entities/lock.entity';

@Injectable()
export class UserLockRelationService {
  constructor(
    @InjectRepository(UserLockRelation)
    private readonly userLockRelationRepository: Repository<UserLockRelation>,
  ) {}
  async create(createUserLockRelationDto: CreateUserLockRelationDto) {
    const hasOwner = await this.checkIfLockHasOwner(
      createUserLockRelationDto.lockID,
    );
    const relation: UserLockRelation = {
      lockID: createUserLockRelationDto.lockID,
      userID: createUserLockRelationDto.userID,
      owner: (createUserLockRelationDto.owner && !hasOwner) || false,
    };
    try {
      return await this.userLockRelationRepository.save(relation);
    } catch (err) {
      throw new ConflictException('This relation already exists');
    }
  }

  async checkIfLockHasOwner(lockID: string) {
    const relations = await this.userLockRelationRepository.find({
      where: {
        lockID,
      },
    });
    relations.forEach((relation) => {
      if (relation.owner) return true;
    });
    return false;
  }

  async update(updateUserLockRelationDto: UpdateUserLockRelationDto) {
    const relation = await this.userLockRelationRepository.findOne({
      where: {
        userID: updateUserLockRelationDto.userID,
        lockID: updateUserLockRelationDto.lockID,
      },
    });
    const updatedRelation: UserLockRelation = {
      userID: relation.userID,
      lockID: relation.lockID,
      owner: this.isNullValue(updateUserLockRelationDto.owner)
        ? relation.owner
        : updateUserLockRelationDto.owner,
    };
    try {
      await this.userLockRelationRepository.save(updatedRelation);
    } catch (err) {
      throw new ConflictException('This relation already exists');
    }
  }

  isNullValue(value: any) {
    return value === null || value === undefined;
  }

  async remove(findUserLockRelationDTO: FindUserLockRelationDTO) {
    const { userID, lockID } = findUserLockRelationDTO;
    const allLockRelations = await this.userLockRelationRepository.find({
      where: { lockID },
    });
    const relation = allLockRelations.find(
      (relation) => relation.userID === userID,
    );
    delete allLockRelations[allLockRelations.indexOf(relation)];
    if (!relation) throw new NotFoundException('This relation does not exist');
    if (relation.owner && allLockRelations.length > 1) {
      const lockUser = allLockRelations[0];
      lockUser.owner = true;
      await this.userLockRelationRepository.save(lockUser);
    }
    await this.userLockRelationRepository.remove(relation);
  }
}
