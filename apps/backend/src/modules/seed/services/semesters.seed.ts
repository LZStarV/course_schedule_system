import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SemestersSeedService {
  async run(sequelize: Sequelize) {
    const list = [
      {
        name: '2025 秋季学期',
        academic_year: '2025-2026',
        start_date: '2025-09-01',
        end_date: '2025-12-31',
      },
      {
        name: '2026 春季学期',
        academic_year: '2025-2026',
        start_date: '2026-02-20',
        end_date: '2026-06-30',
      },
    ];
    for (const s of list) {
      await sequelize.query(
        `INSERT INTO semesters(id, name, academic_year, start_date, end_date, status, is_current, created_at, updated_at)
         SELECT uuid_generate_v4(), :name, :academic_year, :start_date::date, :end_date::date, 'DRAFT', FALSE, NOW(), NOW()
         WHERE NOT EXISTS (SELECT 1 FROM semesters WHERE name=:name AND academic_year=:academic_year)`,
        { replacements: s as any }
      );
    }
  }
}
