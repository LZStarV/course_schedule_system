import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { AdminService } from './admin.service';
import { validateDto } from '../../common/utils/validate';
import { SetSelectTimeDto } from './dto/set-select-time.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminController implements OnModuleInit {
  constructor(
    @Inject(RpcRegistry) private readonly registry: RpcRegistry,
    @Inject(AdminService) private readonly service: AdminService
  ) {}

  onModuleInit() {
    this.registry.register('Admin.SetSelectTime', async (params: Record<string, unknown>) => {
      const dto = validateDto(SetSelectTimeDto, params);
      return await this.service.setSelectTime({ startTime: dto.startTime, endTime: dto.endTime });
    });

    this.registry.register('Admin.ListUsers', async (params: Record<string, unknown>) => {
      const dto = validateDto(ListUsersDto, params);
      return await this.service.listUsers(dto);
    });

    this.registry.register('Admin.CreateUser', async (params: Record<string, unknown>) => {
      const dto = validateDto(CreateUserDto, params);
      return await this.service.createUser(dto);
    });

    this.registry.register('Admin.UpdateUser', async (params: Record<string, unknown>) => {
      const dto = validateDto(UpdateUserDto, params);
      return await this.service.updateUser(dto);
    });

    this.registry.register('Admin.DeleteUser', async (params: Record<string, unknown>) => {
      const dto = validateDto(UpdateUserDto, params);
      return await this.service.softDeleteUser(dto.id);
    });
  }
}
