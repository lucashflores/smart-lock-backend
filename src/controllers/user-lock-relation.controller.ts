import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UserLockRelationService } from '../services/user-lock-relation.service';
import { CreateUserLockRelationDto } from '../dto/user-lock-relation/create-user-lock-relation.dto';
import { UpdateUserLockRelationDto } from '../dto/user-lock-relation/update-user-lock-relation.dto';
import { FindUserLockRelationDTO } from 'src/dto/user-lock-relation/find-user-lock-relation.dto';

@Controller('v1/relations')
export class UserLockRelationController {
  constructor(
    private readonly userLockRelationService: UserLockRelationService,
  ) {}

  @Post('')
  async create(@Body() createUserLockRelationDto: CreateUserLockRelationDto) {
    return {
      status: 'OK',
      data: await this.userLockRelationService.create(
        createUserLockRelationDto,
      ),
    };
  }

  @Get('/user/:user_email')
  async findAllUserLocks(@Param('user_email') userEmail: string) {
    return {
      status: 'OK',
      data: await this.userLockRelationService.findAllUserLocks(userEmail),
    };
  }

  @Get('/lock/:lock_id')
  async findAll(@Param('lock_id') lockID: string) {
    return {
      status: 'OK',
      data: await this.userLockRelationService.findAllLockUsers(lockID),
    };
  }

  @Get('')
  async findOne(@Query() findUserLockRelationDTO: FindUserLockRelationDTO) {
    return {
      status: 'OK',
      data: await this.userLockRelationService.findRelation(
        findUserLockRelationDTO,
      ),
    };
  }

  @Put('')
  @HttpCode(204)
  async update(@Body() updateUserLockRelationDto: UpdateUserLockRelationDto) {
    await this.userLockRelationService.update(updateUserLockRelationDto);
  }

  @Delete('')
  async remove(@Query() findUserLockRelationDTO: FindUserLockRelationDTO) {
    await this.userLockRelationService.remove(findUserLockRelationDTO);
  }
}
