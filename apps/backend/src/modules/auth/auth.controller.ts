import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { RpcRegistry } from '../../common/rpc/rpc.registry';
import { AuthService } from './auth.service';
import { validateDto } from '../../common/utils/validate';
import { LoginDto } from './dto/login.dto';
import { GetPermissionsDto } from './dto/get-permissions.dto';
import { RefreshPermissionsDto } from './dto/refresh-permissions.dto';

@Injectable()
export class AuthController implements OnModuleInit {
  constructor(
    @Inject(RpcRegistry) private readonly registry: RpcRegistry,
    @Inject(AuthService) private readonly service: AuthService
  ) {}

  onModuleInit() {
    this.registry.register('Auth.Login', async (params: Record<string, unknown>) => {
      const dto = validateDto(LoginDto, params);
      return await this.service.login({ username: dto.username, password: dto.password });
    });

    this.registry.register(
      'Auth.GetPermissions',
      async (params: Record<string, unknown>, context?: Record<string, unknown>) => {
        validateDto(GetPermissionsDto, params);
        return await this.service.getPermissions(context);
      }
    );

    this.registry.register(
      'Auth.RefreshPermissions',
      async (params: Record<string, unknown>, context?: Record<string, unknown>) => {
        const dto = validateDto(RefreshPermissionsDto, params);
        return await this.service.refreshPermissions(dto, context);
      }
    );
  }
}
