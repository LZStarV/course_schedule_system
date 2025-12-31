import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
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

    await queryInterface.addIndex(
      'courses',
      ['course_code'],
      {
        name: 'courses_course_code_unique',
        unique: true,
      }
    );
    await queryInterface.addIndex(
      'courses',
      ['teacher_id'],
      { name: 'courses_teacher_id_idx' }
    );
    await queryInterface.addIndex(
      'courses',
      ['department_id'],
      {
        name: 'courses_department_id_idx',
      }
    );
    await queryInterface.addIndex(
      'courses',
      ['academic_year', 'semester'],
      {
        name: 'courses_academic_year_semester_idx',
      }
    );
    await queryInterface.addIndex(
      'courses',
      ['status', 'published_at'],
      {
        name: 'courses_status_published_idx',
      }
    );
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('courses');
  },
};
