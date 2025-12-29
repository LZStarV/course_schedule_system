import { Injectable, OnModuleInit } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { AdminService } from './admin.service';
import { validateDto } from '../../common/utils/validate';
import { SetSelectTimeDto } from './dto/set-select-time.dto';

@Injectable()
export class AdminController implements OnModuleInit {
  constructor(
    private readonly registry: RpcRegistry,
    private readonly service: AdminService
  ) {}

  onModuleInit() {
    this.registry.register('Admin.SetSelectTime', async (params: Record<string, unknown>) => {
      const dto = validateDto(SetSelectTimeDto, params);
      return await this.service.setSelectTime({ startTime: dto.startTime, endTime: dto.endTime });
    });
  }
}
