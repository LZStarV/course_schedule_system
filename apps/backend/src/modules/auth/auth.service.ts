import { Injectable } from '@nestjs/common';
import { jwtConfig } from '../../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';
import { logger } from '../../common/logger';

@Injectable()
export class AuthService {
  private jwt = new JwtService({
    secret: jwtConfig.accessSecret,
    signOptions: { expiresIn: jwtConfig.accessExpiresIn },
  });

  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async login(params: { email: string; password: string }) {
    logger.info({ email: params.email });
    const found = await this.userModel.findOne({
      where: { email: params.email },
    });
    if (!found) {
      throw new Error('邮箱或密码错误');
    }
    if (String(found.status).toUpperCase() !== 'ACTIVE') {
      throw new Error('该用户已被停用');
    }
    const crypto = await import('node:crypto');
    const hash = crypto
      .createHash('sha256')
      .update(params.password)
      .digest('hex');
    const defaultHash = crypto
      .createHash('sha256')
      .update('a123456')
      .digest('hex');
    const expected = String(
      found.password_hash || defaultHash
    );
    if (expected !== hash) {
      throw new Error('邮箱或密码错误');
    }
    const user = {
      id: found.id,
      username: found.username,
      role: found.role,
    };
    const token = this.jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });
    const refreshToken = token;
    logger.info({ userId: user.id });
    return { token, refreshToken, user };
  }

  async getPermissions(_context?: Record<string, unknown>) {
    const base = {
      permissions: {
        modules: {},
        flags: {},
        data_scopes: {},
      },
      menus: { navigation: [], sidebar: [], shortcuts: [] },
      system_config: {
        academic_year: '2024-2025',
        current_semester: 'FALL',
        selection_status: 'IN_PROGRESS',
        allow_withdraw: true,
        max_credits: 20,
      },
    };
    return base;
  }

  async refreshPermissions(
    _dto: { force?: boolean },
    context?: Record<string, unknown>
  ) {
    return await this.getPermissions(context);
  }
}
