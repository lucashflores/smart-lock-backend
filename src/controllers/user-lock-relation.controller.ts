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
  UseGuards,
} from '@nestjs/common';
import { UserLockRelationService } from '../services/user-lock-relation.service';
import { CreateUserLockRelationDto } from '../dto/user-lock-relation/create-user-lock-relation.dto';
import { UpdateUserLockRelationDto } from '../dto/user-lock-relation/update-user-lock-relation.dto';
import { FindUserLockRelationDTO } from 'src/dto/user-lock-relation/find-user-lock-relation.dto';
import { OwnerGuard } from 'src/guards/owner.guard';
import { UserGuard } from 'src/guards/user.guard';

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

  @UseGuards(OwnerGuard)
  @Put('')
  @HttpCode(204)
  async update(@Body() updateUserLockRelationDto: UpdateUserLockRelationDto) {
    await this.userLockRelationService.update(updateUserLockRelationDto);
  }

  @UseGuards(UserGuard)
  @Delete('')
  async remove(@Query() findUserLockRelationDTO: FindUserLockRelationDTO) {
    await this.userLockRelationService.remove(findUserLockRelationDTO);
  }
}
