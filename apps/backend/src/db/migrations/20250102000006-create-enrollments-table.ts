import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export const up = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  const [existsRows]: any = await (
    queryInterface as any
  ).sequelize.query(
    `SELECT to_regclass('enrollments') AS exists`
  );
  if (existsRows?.[0]?.exists) {
    await (queryInterface as any).sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS enrollments_student_course_unique ON enrollments (student_id, course_id, academic_year, semester)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS enrollments_student_id_idx ON enrollments (student_id)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON enrollments (course_id)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS enrollments_section_id_idx ON enrollments (section_id)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS enrollments_academic_year_semester_idx ON enrollments (academic_year, semester)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS enrollments_status_idx ON enrollments (status)`
    );
    return;
  }
  await queryInterface.createTable('enrollments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    course_id: { type: DataTypes.UUID, allowNull: false },
    section_id: { type: DataTypes.UUID, allowNull: true },
    academic_year: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    semester: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'SELECTED',
        'CONFIRMED',
        'WITHDRAWN',
        'FAILED',
        'COMPLETED'
      ),
      allowNull: false,
      defaultValue: 'SELECTED',
    },
    selection_round: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    selection_method: {
      type: DataTypes.ENUM('MANUAL', 'AUTO', 'ADMIN'),
      allowNull: false,
      defaultValue: 'MANUAL',
    },
    enrolled_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    confirmed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    withdrawn_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    grade: { type: DataTypes.STRING(2), allowNull: true },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    gpa_points: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
    },
    teacher_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    student_feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: { type: DataTypes.INET, allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });
  await (queryInterface as any).sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS enrollments_student_course_unique ON enrollments (student_id, course_id, academic_year, semester)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS enrollments_student_id_idx ON enrollments (student_id)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS enrollments_course_id_idx ON enrollments (course_id)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS enrollments_section_id_idx ON enrollments (section_id)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS enrollments_academic_year_semester_idx ON enrollments (academic_year, semester)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS enrollments_status_idx ON enrollments (status)`
  );
};

export const down = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  await queryInterface.dropTable('enrollments');
};
