import { Injectable } from '@nestjs/common';
import { redisClient } from '../../config/redis.config';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { logger } from '../../common/logger';

@Injectable()
export class AdminService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async setSelectTime(params: { startTime: string; endTime: string }) {
    const value = `${params.startTime}~${params.endTime}`;
    logger.info({ selectTime: value });
    await redisClient.set('select:time_window', value);
    await this.sequelize.query(
      `INSERT INTO system_configs (config_key, module, category, config_value, value_type, version, scope, is_encrypted, is_public, created_at, updated_at)
       VALUES ('selection_window','system','selection',:val,'STRING',1,'SYSTEM',false,false,NOW(),NOW())
       ON CONFLICT (config_key) DO UPDATE SET config_value=:val, updated_at=NOW()`,
      { replacements: { val: value } }
    );
    return { updated: true };
  }

  async listUsers(params: {
    keyword?: string;
    role?: string;
    status?: string;
    page?: number;
    page_size?: number;
  }) {
    const page = Number(params.page ?? 1);
    const page_size = Number(params.page_size ?? 10);
    const offset = (page - 1) * page_size;
    const where: string[] = [];
    const replacements: Record<string, unknown> = {};
    if (params.keyword) {
      where.push('(username ILIKE :kw OR email ILIKE :kw)');
      replacements.kw = `%${params.keyword}%`;
    }
    if (params.role) {
      where.push('role = :role');
      replacements.role = params.role;
    }
    if (params.status) {
      where.push('status = :status');
      replacements.status = params.status;
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const [rows] = await this.sequelize.query(
      `SELECT id, username, email, role, status, created_at FROM users ${whereSql} ORDER BY created_at DESC LIMIT :limit OFFSET :offset`,
      { replacements: { ...replacements, limit: page_size, offset } }
    );
    const [[{ count }]]: any = await this.sequelize.query(
      `SELECT COUNT(1) AS count FROM users ${whereSql}`,
      { replacements }
    );
    return {
      data: rows as any[],
      pagination: {
        page,
        page_size,
        total: Number(count),
        total_pages: Math.ceil(Number(count) / page_size),
      },
    };
  }

  async createUser(payload: {
    username: string;
    email: string;
    role: string;
    status: string;
    password: string;
  }) {
    const id =
      (await this.sequelize.query(`SELECT uuid_generate_v4() AS id`))[0]?.[0]?.id || undefined;
    const crypto = await import('node:crypto');
    const hash = crypto.createHash('sha256').update(payload.password).digest('hex');
    await this.sequelize.query(
      `INSERT INTO users (id, username, email, role, status, password_hash, created_at, updated_at)
       VALUES (:id, :username, :email, :role, :status, :password_hash, NOW(), NOW())`,
      {
        replacements: {
          id,
          username: payload.username,
          email: payload.email,
          role: payload.role,
          status: payload.status,
          password_hash: hash,
        },
      }
    );
    return { ok: true };
  }

  async updateUser(payload: {
    id: string;
    email?: string;
    role?: string;
    status?: string;
    password?: string;
  }) {
    const sets: string[] = [];
    const replacements: Record<string, unknown> = { id: payload.id };
    if (payload.email) {
      sets.push('email = :email');
      replacements.email = payload.email;
    }
    if (payload.role) {
      sets.push('role = :role');
      replacements.role = payload.role;
    }
    if (payload.status) {
      sets.push('status = :status');
      replacements.status = payload.status;
    }
    if (payload.password) {
      const crypto = await import('node:crypto');
      replacements.password_hash = crypto
        .createHash('sha256')
        .update(payload.password)
        .digest('hex');
      sets.push('password_hash = :password_hash');
    }
    if (!sets.length) return { ok: true };
    await this.sequelize.query(
      `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = :id`,
      { replacements }
    );
    return { ok: true };
  }

  async softDeleteUser(id: string) {
    await this.sequelize.query(
      `UPDATE users SET status = 'INACTIVE', updated_at = NOW() WHERE id = :id`,
      { replacements: { id } }
    );
    return { ok: true };
  }
}
