import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserLockRelationService } from '../services/user-lock-relation.service';
import { CreateUserLockRelationDto } from '../dto/user-lock-relation/create-user-lock-relation.dto';
import { UpdateUserLockRelationDto } from '../dto/user-lock-relation/update-user-lock-relation.dto';

@Controller('user-lock-relation')
export class UserLockRelationController {
  constructor(
    private readonly userLockRelationService: UserLockRelationService,
  ) {}

  @Post()
  create(@Body() createUserLockRelationDto: CreateUserLockRelationDto) {
    return this.userLockRelationService.create(createUserLockRelationDto);
  }

  @Get()
  findAll() {
    return this.userLockRelationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userLockRelationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserLockRelationDto: UpdateUserLockRelationDto,
  ) {
    return this.userLockRelationService.update(+id, updateUserLockRelationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userLockRelationService.remove(+id);
  }
}
