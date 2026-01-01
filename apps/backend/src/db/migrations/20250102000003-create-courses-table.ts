import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export const up = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  const [existsRows]: any = await (
    queryInterface as any
  ).sequelize.query(
    `SELECT to_regclass('courses') AS exists`
  );
  if (existsRows?.[0]?.exists) {
    await (queryInterface as any).sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS courses_course_code_unique ON courses (course_code)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS courses_teacher_id_idx ON courses (teacher_id)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS courses_department_id_idx ON courses (department_id)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS courses_academic_year_semester_idx ON courses (academic_year, semester)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS courses_status_published_idx ON courses (status, published_at)`
    );
    return;
  }
  await queryInterface.createTable('courses', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    course_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    course_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    english_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    credit: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
    },
    credit_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    course_type: {
      type: DataTypes.ENUM(
        'COMPULSORY',
        'ELECTIVE',
        'GENERAL',
        'EXPERIMENTAL',
        'PRACTICE'
      ),
      allowNull: false,
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    teacher_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    academic_year: {
      type: DataTypes.STRING(9),
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM(
        'FALL',
        'SPRING',
        'SUMMER',
        'WINTER'
      ),
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    enrolled_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'PENDING_REVIEW',
        'REJECTED',
        'PUBLISHED',
        'SELECTING',
        'SELECTION_ENDED',
        'IN_PROGRESS',
        'ENDED',
        'ARCHIVED'
      ),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: { weekly: [], specific_dates: [] },
    },
    location_type: {
      type: DataTypes.ENUM(
        'CLASSROOM',
        'LAB',
        'ONLINE',
        'MIXED'
      ),
      allowNull: false,
      defaultValue: 'CLASSROOM',
    },
    location_details: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    objectives: { type: DataTypes.TEXT, allowNull: true },
    syllabus: { type: DataTypes.TEXT, allowNull: true },
    assessment_method: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    textbook_reference: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    restrictions: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {
        grade_limits: [],
        major_limits: [],
        prerequisites: [],
        conflict_courses: [],
      },
    },
    view_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    favorite_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    review_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewed_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
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
    `CREATE UNIQUE INDEX IF NOT EXISTS courses_course_code_unique ON courses (course_code)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS courses_teacher_id_idx ON courses (teacher_id)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS courses_department_id_idx ON courses (department_id)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS courses_academic_year_semester_idx ON courses (academic_year, semester)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS courses_status_published_idx ON courses (status, published_at)`
  );
};

export const down = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  await queryInterface.dropTable('courses');
};
