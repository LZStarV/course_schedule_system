import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { seedConfig } from '../seed-config';

@Injectable()
export class DepartmentsSeedService {
  async run(sequelize: Sequelize) {
    const adminRes: any = await sequelize.query(
      "SELECT id FROM users WHERE username = 'superadmin' LIMIT 1"
    );
    const adminId = adminRes[0]?.[0]?.id || null;
    for (const item of seedConfig.departments) {
      const sql = `INSERT INTO departments (
        id, code, name, full_name, description, parent_id, level, path,
        contact_person, contact_phone, contact_email, location,
        status, display_order, created_by, updated_by, created_at, updated_at
      ) VALUES (
        uuid_generate_v4(), :code, :name, :full_name, NULL, NULL, 1, NULL,
        NULL, NULL, NULL, NULL,
        'ACTIVE', 0, :created_by, :updated_by, NOW(), NOW()
      ) ON CONFLICT (code) DO NOTHING`;
      await sequelize.query(sql, {
        replacements: {
          code: item.code,
          name: item.name,
          full_name: item.full_name ?? item.name,
          created_by: adminId,
          updated_by: adminId,
        },
      });
      await sequelize.query(
        `UPDATE departments SET path=id WHERE code=:code`,
        {
          replacements: { code: item.code },
        }
      );
    }
  }
}
