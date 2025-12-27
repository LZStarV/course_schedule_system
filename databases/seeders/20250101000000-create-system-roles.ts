import type { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface: QueryInterface) => {
    const id = uuidv4();
    const cfg = {
      roles: [
        { code: 'STUDENT', name: '学生' },
        { code: 'TEACHER', name: '教师' },
        { code: 'ADMIN', name: '管理员' },
        { code: 'SUPER_ADMIN', name: '超级管理员' },
      ],
    };
    await queryInterface.sequelize.query(
      `INSERT INTO system_configs (
        id, config_key, module, category, config_value, value_type, description, version, scope, is_encrypted, is_public, created_at, updated_at
      ) VALUES (
        :id, 'system_roles', 'system', 'security', :cfg::jsonb, 'OBJECT', '系统角色定义', 1, 'SYSTEM', false, false, :created_at, :updated_at
      )`,
      {
        replacements: {
          id,
          cfg: JSON.stringify(cfg),
          created_at: new Date(),
          updated_at: new Date(),
        },
      }
    );
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('system_configs', { config_key: 'system_roles' });
  },
};
