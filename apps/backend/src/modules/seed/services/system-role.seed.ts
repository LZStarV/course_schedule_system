import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { seedConfig } from '../seed-config';

@Injectable()
export class SystemRoleSeedService {
  async run(sequelize: Sequelize) {
    const id = uuidv4();
    const cfg = JSON.stringify({ roles: seedConfig.roles });
    const sql = `INSERT INTO system_configs (
      id, config_key, module, category, config_value, value_type, description, version, scope, is_encrypted, is_public, created_at, updated_at
    ) SELECT
      :id, 'system_roles', 'system', 'security', :cfg::jsonb, 'OBJECT', '系统角色定义', 1, 'SYSTEM', false, false, NOW(), NOW()
    WHERE NOT EXISTS (
      SELECT 1 FROM system_configs WHERE config_key = 'system_roles'
    )`;
    await sequelize.query(sql, {
      replacements: { id, cfg },
    });
  }
}
