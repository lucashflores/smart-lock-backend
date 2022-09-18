import {
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
    @Inject(forwardRef(() => UserLockRelationService))
    private readonly userLockRelationService: UserLockRelationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const password = await hash(
      createUserDto.password,
      process.env.SALT_ROUNDS,
    );
    const newUser: Partial<User> = {
      email: createUserDto.email,
      name: createUserDto.name,
      password,
    };
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find({});
  }

  async findByEmail(userEmail: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: userEmail,
      },
    });
    if (!user)
      throw new NotFoundException('An user with this id could not be found');
    return user;
  }

  async findByID(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user)
      throw new NotFoundException('An user with this id could not be found');
    return user;
  }

  async update(userEmail: string, updateUserDto: UpdateUserDto) {
    const user = await this.findByEmail(userEmail);
    let newPassword = null;
    if (updateUserDto.password) {
      newPassword = await hash(updateUserDto.password, process.env.SALT_ROUNDS);
    }
    const updatedUser: User = {
      id: user.id,
      email: updateUserDto.email || user.email,
      name: updateUserDto.name || user.name,
      password: newPassword || user.password,
      fingerprint: updateUserDto.fingerprint || user.fingerprint,
      face: updateUserDto.face || user.face,
    };
    await this.userRepository.save(updatedUser);
  }

  async remove(userEmail: string) {
    const user = await this.findByEmail(userEmail);
    await this.userLockRelationService.removeAllUserRelations(user.id);
    await this.userRepository.delete({ email: userEmail });
  }
}
