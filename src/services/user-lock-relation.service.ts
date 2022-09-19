import {
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

@Injectable()
export class UserLockRelationService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => LockService))
    private readonly lockService: LockService,
    @InjectRepository(UserLockRelation)
    private readonly userLockRelationRepository: Repository<UserLockRelation>,
  ) {}
  async create(createUserLockRelationDto: CreateUserLockRelationDto) {
    const user = await this.userService.findByEmail(
      createUserLockRelationDto.userEmail,
    );
    if (createUserLockRelationDto.owner)
      await this.checkIfLockHasOwner(createUserLockRelationDto.lockID);
    const relation: UserLockRelation = {
      lockID: createUserLockRelationDto.lockID,
      userID: user.id,
      owner: createUserLockRelationDto.owner || false,
    };
    return await this.userLockRelationRepository.save(relation);
  }

  async findAllLockUsers(lockID: string) {
    const allLockRelations = await this.userLockRelationRepository.find({
      where: {
        lockID,
      },
    });
    let users = [];
    allLockRelations.forEach((relation) => {
      users.push(this.userService.findByID(relation.userID));
    });
    users = (await Promise.allSettled(users))
      .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
      .filter((user) => user);
    return users;
  }

  async checkIfLockHasOwner(lockID: string) {
    const allLockRelations = await this.userLockRelationRepository.find({
      where: {
        lockID,
      },
    });
    allLockRelations.forEach((relation) => {
      if (relation.owner)
        throw new UnauthorizedException('Lock already has an owner');
    });
    return false;
  }

  async findAllUserLocksRelations(userID: string) {
    return await this.userLockRelationRepository.find({
      where: {
        userID,
      },
    });
  }

  async findAllLockUsersRelations(lockID: string) {
    return await this.userLockRelationRepository.find({
      where: {
        lockID,
      },
    });
  }

  async findAllUserLocks(userEmail: string) {
    const user = await this.userService.findByEmail(userEmail);
    const allUserLockRelations = await this.userLockRelationRepository.find({
      where: {
        userID: user.id,
      },
    });
    let locks = [];
    allUserLockRelations.forEach((relation) => {
      locks.push(this.lockService.findByID(relation.lockID));
    });
    locks = (await Promise.allSettled(locks))
      .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
      .filter((lock) => lock);
    return locks;
  }

  async findRelation(findUserLockRelationDTO: FindUserLockRelationDTO) {
    const { userEmail, lockID } = findUserLockRelationDTO;
    const user = await this.userService.findByEmail(userEmail);
    const lock = await this.lockService.findByID(lockID);
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
    const relation = await this.findRelation({
      userEmail: updateUserLockRelationDto.userEmail,
      lockID: updateUserLockRelationDto.lockID,
    });
    const updatedRelation: UserLockRelation = {
      userID: relation.userID,
      lockID: relation.lockID,
      owner: this.isNullValue(updateUserLockRelationDto.owner)
        ? relation.owner
        : updateUserLockRelationDto.owner,
    };
    await this.userLockRelationRepository.save(updatedRelation);
  }

  isNullValue(value: any) {
    return value === null || value === undefined;
  }

  async remove(findUserLockRelationDTO: FindUserLockRelationDTO) {
    const { userEmail, lockID } = findUserLockRelationDTO;
    const relation = await this.findRelation({ userEmail, lockID });
    if (relation.owner) {
      const lockUsers = (await this.findAllLockUsersRelations(lockID)).filter(
        (user) =>
          !(user.lockID === relation.lockID && user.userID === user.userID),
      );
      if (lockUsers.length > 0) {
        const lockUser = lockUsers[0];
        const newOwner: UserLockRelation = {
          lockID,
          userID: lockUser.userID,
          owner: true,
        };
        await this.userLockRelationRepository.save(newOwner);
      } else {
        await this.lockService.remove(lockID);
      }
    }
    await this.userLockRelationRepository.delete({
      userID: relation.userID,
      lockID,
    });
  }

  async removeAllLockRelations(lockID: string) {
    const allRelations = await this.findAllLockUsersRelations(lockID);
    const promises = [];
    allRelations.forEach((relation) => {
      promises.push(
        this.userLockRelationRepository.delete({
          lockID,
          userID: relation.userID,
        }),
      );
    });
    await Promise.allSettled(promises);
  }

  async removeAllUserRelations(userEmail: string) {
    const user = await this.userService.findByEmail(userEmail);
    const allRelations = await this.findAllUserLocksRelations(user.id);
    const promises = [];
    allRelations.forEach((relation) => {
      promises.push(
        this.remove({
          userEmail,
          lockID: relation.lockID,
        }),
      );
    });
    await Promise.allSettled(promises);
  }
}
