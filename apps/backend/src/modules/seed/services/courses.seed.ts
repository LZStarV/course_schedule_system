import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { seedConfig } from '../seed-config';

@Injectable()
export class CoursesSeedService {
  async run(sequelize: Sequelize) {
    const deptRes: any = await sequelize.query(
      "SELECT id FROM departments WHERE code='CS' LIMIT 1"
    );
    const teacherRes: any = await sequelize.query(
      "SELECT id FROM users WHERE role='SUPER_ADMIN' LIMIT 1"
    );
    const deptId = deptRes[0]?.[0]?.id;
    const teacherId = teacherRes[0]?.[0]?.id;
    if (!deptId || !teacherId) return;
    for (const c of seedConfig.courses) {
      const sql = `INSERT INTO courses (
        id, course_code, course_number, name, english_name, credit, credit_hours, course_type,
        department_id, teacher_id, academic_year, semester, capacity, min_quota, enrolled_count,
        status, schedule, location_type, location_details, description, objectives, syllabus,
        assessment_method, textbook_reference, attachments, restrictions, view_count, favorite_count,
        review_notes, reviewed_at, reviewed_by, published_at, created_at, updated_at
      ) VALUES (
        uuid_generate_v4(), :course_code, :course_number, :name, :english_name, :credit, :credit_hours, 'COMPULSORY',
        :department_id, :teacher_id, :academic_year, :semester, :capacity, :min_quota, 0,
        'PUBLISHED', '{"weekly":[],"specific_dates":[]}'::jsonb, 'CLASSROOM', '{}'::jsonb, NULL, NULL, NULL,
        NULL, NULL, '[]'::jsonb, '{"grade_limits":[],"major_limits":[],"prerequisites":[],"conflict_courses":[]}'::jsonb, 0, 0,
        NULL, NOW(), :teacher_id, NOW(), NOW(), NOW()
      ) ON CONFLICT (course_code) DO NOTHING`;
      await sequelize.query(sql, {
        replacements: {
          course_code: c.course_code,
          course_number: c.course_number,
          name: c.name,
          english_name: c.english_name,
          credit: c.credit,
          credit_hours: c.credit_hours,
          department_id: deptId,
          teacher_id: teacherId,
          capacity: c.capacity,
          min_quota: c.min_quota,
          academic_year: c.academic_year,
          semester: c.semester,
        },
      });
    }
  }
}
