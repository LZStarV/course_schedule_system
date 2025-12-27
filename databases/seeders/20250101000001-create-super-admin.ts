import type { QueryInterface } from 'sequelize';
import type { User } from '@packages/shared-types';
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface: QueryInterface) => {
    const adminId = uuidv4();
    const sample: User = {
      id: adminId,
      username: 'superadmin',
      email: 'admin@course-select.edu',
      phone: '13800138000',
      real_name: '系统管理员',
      avatar_url: null as any,
      gender: 'SECRET',
      birth_date: null as any,
      student_id: null as any,
      teacher_id: 'T000001',
      department_id: null as any,
      major: null as any,
      grade: null as any,
      class_name: null as any,
      password_hash: 'dev-hash',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      last_login_at: null as any,
      failed_login_attempts: 0,
      locked_until: null as any,
      created_by: adminId,
      updated_by: adminId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const now = new Date().toISOString();
    await queryInterface.sequelize.query(
      `INSERT INTO users (
        id, username, email, phone, real_name, avatar_url, gender, birth_date,
        student_id, teacher_id, department_id, major, grade, class_name,
        password_hash, role, status, last_login_at, failed_login_attempts, locked_until,
        created_by, updated_by, created_at, updated_at
      ) VALUES (
        :id, 'superadmin', 'admin@course-select.edu', '13800138000', '系统管理员', NULL, 'SECRET', NULL,
        NULL, 'T000001', NULL, NULL, NULL, NULL,
        'dev-hash', 'SUPER_ADMIN', 'ACTIVE', NULL, 0, NULL,
        :created_by, :updated_by, :created_at, :updated_at
      ) ON CONFLICT (username) DO NOTHING`,
      {
        replacements: {
          id: sample.id,
          created_by: sample.created_by,
          updated_by: sample.updated_by,
          created_at: sample.created_at,
          updated_at: sample.updated_at,
        },
      }
    );
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('users', { username: 'superadmin' });
  },
};
