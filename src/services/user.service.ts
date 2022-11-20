import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { UserLockRelationService } from './user-lock-relation.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = await hash(
      createUserDto.password,
      +process.env.SALT_ROUNDS,
    );
    const newUser: Partial<User> = {
      email: createUserDto.email,
      name: createUserDto.name,
      password,
    };
    try {
      return await this.userRepository.save(newUser);
    } catch (err) {
      throw new ConflictException('An user with this email already exists');
    }
  }

  async findAllUserLocks(userID: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userID,
      },
      relations: ['relations', 'relations.lock'],
    });
    return user.relations.map((relation) => {
      return { ...relation.lock, owner: relation.owner };
    });
  }

  async findByEmail(userEmail: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: userEmail,
      },
    });
    if (!user)
      throw new NotFoundException('An user with this email could not be found');
    return user;
  }

  async update(userEmail: string, updateUserDto: UpdateUserDto) {
    const user = await this.findByEmail(userEmail);
    let newPassword = null;
    if (updateUserDto.password) {
      newPassword = await hash(
        updateUserDto.password,
        +process.env.SALT_ROUNDS,
      );
    }
    const updatedUser: User = {
      id: user.id,
      email: updateUserDto.email || user.email,
      name: updateUserDto.name || user.name,
      password: newPassword || user.password,
    };
    try {
      await this.userRepository.save(updatedUser);
    } catch (err) {
      throw new ConflictException('An user with this email already exists');
    }
  }

  async remove(userEmail: string) {
    const user = await this.findByEmail(userEmail);
    await this.userRepository.remove(user);
  }
}
