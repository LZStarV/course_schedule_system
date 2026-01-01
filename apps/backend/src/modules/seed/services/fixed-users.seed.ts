import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { seedDefaults } from '../seed-config';

@Injectable()
export class FixedUsersSeedService {
  async run(sequelize: Sequelize) {
    const csDept = await this.getDept(sequelize, 'CS');
    await this.ensureUser(sequelize, {
      username: 'admin001',
      email: `admin001@${seedDefaults.emailDomain}`,
      real_name: '管理员',
      role: 'ADMIN',
      department_id: null,
      teacher_id: null,
      student_id: null,
    });
    await this.ensureUser(sequelize, {
      username: 'teacher001',
      email: `teacher001@${seedDefaults.emailDomain}`,
      real_name: '教师',
      role: 'TEACHER',
      department_id: csDept,
      teacher_id: 'T000100',
      student_id: null,
    });
    await this.ensureUser(sequelize, {
      username: 'student001',
      email: `student001@${seedDefaults.emailDomain}`,
      real_name: '学生',
      role: 'STUDENT',
      department_id: csDept,
      teacher_id: null,
      student_id: 'S000100',
    });
  }

  private async getDept(
    sequelize: Sequelize,
    code: string
  ) {
    const [rows]: any = await sequelize.query(
      `SELECT id FROM departments WHERE code=:code LIMIT 1`,
      { replacements: { code } }
    );
    return rows?.[0]?.id ?? null;
  }

  private async ensureUser(
    sequelize: Sequelize,
    u: {
      username: string;
      email: string;
      real_name: string;
      role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'SUPER_ADMIN';
      department_id: string | null;
      teacher_id: string | null;
      student_id: string | null;
    }
  ) {
    const id = uuidv4();
    await sequelize.query(
      `INSERT INTO users(
        id, username, email, real_name, gender, password_hash,
        role, status, department_id, teacher_id, student_id,
        created_at, updated_at
      ) SELECT
        :id, :username, :email, :real_name, 'SECRET', crypt('a123456', gen_salt('bf')),
        :role, 'ACTIVE', :department_id, :teacher_id, :student_id,
        NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM users WHERE username=:username
      )`,
      { replacements: { id, ...u } }
    );
  }
}
