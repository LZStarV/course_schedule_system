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
}
