import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LockService } from '../services/lock.service';
import { CreateLockDto } from '../dto/lock/create-lock.dto';
import { UpdateLockDto } from '../dto/lock/update-lock.dto';
import { LockGuard } from 'src/guards/lock.guard';
import { OwnerGuard } from 'src/guards/owner.guard';

@Controller('v1/locks')
export class LockController {
  constructor(private readonly lockService: LockService) {}

  @Post()
  async create(@Body() createLockDto: CreateLockDto) {
    return { status: 'OK', data: await this.lockService.create(createLockDto) };
  }

  @UseGuards(LockGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { status: 'OK', data: await this.lockService.findByID(id) };
  }

  @UseGuards(LockGuard)
  @Post('/unlock/:id')
  async unlock(@Param('id') id: string) {
    await this.lockService.unlock(id);
    return {
      status: 'OK',
      message: 'Successfully unlocked the requested lock',
    };
  }

  @UseGuards(OwnerGuard)
  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLockDto: UpdateLockDto) {
    await this.lockService.update(id, updateLockDto);
  }

  @UseGuards(OwnerGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.lockService.remove(id);
  }

  @UseGuards(OwnerGuard)
  @Get('/users/:lock_id')
  async findAll(@Param('lock_id') lockID: string) {
    return {
      status: 'OK',
      data: await this.lockService.findAllLockUsers(lockID),
    };
  }
}
