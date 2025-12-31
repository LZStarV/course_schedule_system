import type { QueryInterface } from 'sequelize';
import type { Department } from '@packages/shared-types';
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface: QueryInterface) => {
    const now = new Date();
    const admin = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'superadmin' LIMIT 1"
    );
    const adminId = (admin as any)[0][0]?.id || null;
    const items = [
      { code: 'CS', name: '计算机科学与技术学院' },
      { code: 'MA', name: '数学科学学院' },
      { code: 'PH', name: '物理学院' },
      { code: 'CH', name: '化学学院' },
      { code: 'BU', name: '商学院' },
    ].map(x => ({
      id: uuidv4(),
      code: x.code,
      name: x.name,
      full_name: x.name,
      description: null,
      parent_id: null,
      level: 1,
      path: null,
      contact_person: null,
      contact_phone: null,
      contact_email: null,
      location: null,
      status: 'ACTIVE',
      display_order: 0,
      created_by: adminId,
      updated_by: adminId,
      created_at: now,
      updated_at: now,
    }));
    const typeCheck: Department[] = items.map(d => ({
      id: d.id,
      code: d.code,
      name: d.name,
      full_name: d.full_name,
      description: null as any,
      parent_id: null as any,
      level: 1,
      path: null as any,
      contact_person: null as any,
      contact_phone: null as any,
      contact_email: null as any,
      location: null as any,
      status: 'ACTIVE',
      display_order: 0,
      created_by: d.created_by as any,
      updated_by: d.updated_by as any,
      created_at: (d.created_at as Date).toISOString(),
      updated_at: (d.updated_at as Date).toISOString(),
    }));
    for (const d of typeCheck) {
      await queryInterface.sequelize.query(
        `INSERT INTO departments (
          id, code, name, full_name, description, parent_id, level, path,
          contact_person, contact_phone, contact_email, location,
          status, display_order, created_by, updated_by, created_at, updated_at
        ) VALUES (
          :id, :code, :name, :full_name, NULL, NULL, 1, NULL,
          NULL, NULL, NULL, NULL,
          'ACTIVE', 0, :created_by, :updated_by, :created_at, :updated_at
        ) ON CONFLICT (code) DO NOTHING`,
        {
          replacements: {
            id: d.id,
            code: d.code,
            name: d.name,
            full_name: d.full_name,
            created_by: d.created_by as any,
            updated_by: d.updated_by as any,
            created_at: d.created_at,
            updated_at: d.updated_at,
          },
        }
      );
      await queryInterface.sequelize.query(
        `UPDATE departments SET path=:path WHERE id=:id`,
        {
          replacements: { path: d.id, id: d.id },
        }
      );
    }
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('departments', {
      code: ['CS', 'MA', 'PH', 'CH', 'BU'],
    });
  },
};
