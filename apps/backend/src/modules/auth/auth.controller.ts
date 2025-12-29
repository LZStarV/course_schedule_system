import { Injectable, OnModuleInit } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { AuthService } from './auth.service';
import { validateDto } from '../../common/utils/validate';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthController implements OnModuleInit {
  constructor(
    private readonly registry: RpcRegistry,
    private readonly service: AuthService
  ) {}

  onModuleInit() {
    this.registry.register('Auth.Login', async (params: Record<string, unknown>) => {
      const dto = validateDto(LoginDto, params);
      return await this.service.login({ username: dto.username, password: dto.password });
    });
  }
}
