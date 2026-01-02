import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { validateDto } from '../../common/utils/validate';
import { LoginDto } from './dto/login.dto';
import { GetPermissionsDto } from './dto/get-permissions.dto';
import { RefreshPermissionsDto } from './dto/refresh-permissions.dto';

@Injectable()
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly service: AuthService
  ) {}

  async login(params: Record<string, unknown>) {
    const dto = validateDto(LoginDto, params);
    return await this.service.login({
      username: dto.username,
      password: dto.password,
    });
  }

  async getPermissions(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    validateDto(GetPermissionsDto, params);
    return await this.service.getPermissions(context);
  }

  async refreshPermissions(
    params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    const dto = validateDto(RefreshPermissionsDto, params);
    return await this.service.refreshPermissions(
      dto,
      context
    );
  }
}
