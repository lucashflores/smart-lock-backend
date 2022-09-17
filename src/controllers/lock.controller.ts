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
} from '@nestjs/common';
import { LockService } from '../services/lock.service';
import { CreateLockDto } from '../dto/lock/create-lock.dto';
import { UpdateLockDto } from '../dto/lock/update-lock.dto';

@Controller('v1/locks')
export class LockController {
  constructor(private readonly lockService: LockService) {}

  @Post()
  async create(@Body() createLockDto: CreateLockDto) {
    return { status: 'OK', data: await this.lockService.create(createLockDto) };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { status: 'OK', data: await this.lockService.findByID(id) };
  }

  @Post('/unlock/:id')
  async unlock(@Param('id') id: string) {
    await this.lockService.unlock(id, '');
  }

  @HttpCode(204)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateLockDto: UpdateLockDto) {
    await this.lockService.update(id, updateLockDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.lockService.remove(id);
  }
}
