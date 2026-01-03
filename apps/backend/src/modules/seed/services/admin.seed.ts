import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { seedConfig } from '../seed-config';

@Injectable()
export class AdminSeedService {
  async run(sequelize: Sequelize) {
    const id = uuidv4();
    const crypto = await import('node:crypto');
    const password_hash = crypto
      .createHash('sha256')
      .update('a123456')
      .digest('hex');
    const sql = `INSERT INTO users (
      id, username, email, phone, real_name, avatar_url, gender, birth_date,
      student_id, teacher_id, department_id, major, grade, class_name,
      password_hash, role, status, last_login_at, failed_login_attempts, locked_until,
      created_by, updated_by, created_at, updated_at
    ) VALUES (
      :id, :username, :email, :phone, :real_name, NULL, 'SECRET', NULL,
      NULL, :teacher_id, NULL, NULL, NULL, NULL,
      :password_hash, 'SUPER_ADMIN', 'ACTIVE', NULL, 0, NULL,
      :created_by, :updated_by, NOW(), NOW()
    ) ON CONFLICT (username) DO NOTHING`;
    await sequelize.query(sql, {
      replacements: {
        id,
        username: seedConfig.admin.username,
        email: seedConfig.admin.email,
        phone: seedConfig.admin.phone,
        real_name: seedConfig.admin.real_name,
        teacher_id: seedConfig.admin.teacher_id,
        created_by: id,
        updated_by: id,
        password_hash,
      },
    });
  }
}
