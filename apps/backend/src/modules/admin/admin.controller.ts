import { Injectable, Inject } from '@nestjs/common';
import { AdminService } from './admin.service';
import { validateDto } from '../../common/utils/validate';
import { SetSelectTimeDto } from './dto/set-select-time.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminController {
  constructor(
    @Inject(AdminService)
    private readonly service: AdminService
  ) {}

  async setSelectTime(params: Record<string, unknown>) {
    const dto = validateDto(SetSelectTimeDto, params);
    return await this.service.setSelectTime({
      startTime: dto.startTime,
      endTime: dto.endTime,
    });
  }

  async listUsers(params: Record<string, unknown>) {
    const dto = validateDto(ListUsersDto, params);
    return await this.service.listUsers(dto);
  }

  async createUser(params: Record<string, unknown>) {
    const dto = validateDto(CreateUserDto, params);
    return await this.service.createUser(dto);
  }

  async updateUser(params: Record<string, unknown>) {
    const dto = validateDto(UpdateUserDto, params);
    return await this.service.updateUser(dto);
  }

  async deleteUser(params: Record<string, unknown>) {
    const dto = validateDto(UpdateUserDto, params);
    return await this.service.softDeleteUser(dto.id);
  }
}
