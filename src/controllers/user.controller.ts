import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { UpdateUserDto } from '../dto/user/update-user.dto';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      status: 'OK',
      data: await this.userService.create(createUserDto),
    };
  }

  @Get()
  async findAll() {
    return {
      status: 'OK',
      data: await this.userService.findAll(),
    };
  }

  @Get(':user_email')
  findOne(@Param('user_email') userEmail: string) {
    return this.userService.findByEmail(userEmail);
  }

  @Put(':user_email')
  update(
    @Param('user_email') userEmail: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userEmail, updateUserDto);
  }

  @Delete(':user_email')
  remove(@Param('user_email') userEmail: string) {
    return this.userService.remove(userEmail);
  }
}
