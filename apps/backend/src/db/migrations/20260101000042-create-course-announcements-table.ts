import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('course_announcements') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('course_announcements', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      course_id: { type: DataTypes.UUID, allowNull: false },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      content: { type: DataTypes.TEXT, allowNull: false },
      category: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          'DRAFT',
          'PUBLISHED',
          'ARCHIVED'
        ),
        allowNull: false,
        defaultValue: 'PUBLISHED',
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
    await qi.addConstraint('course_announcements', {
      type: 'foreign key',
      name: 'fk_announcements_course',
      fields: ['course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
  try {
    await qi.addIndex('course_announcements', {
      name: 'course_announcements_course_idx',
      fields: ['course_id'],
    });
  } catch {}
  try {
    await qi.addIndex('course_announcements', {
      name: 'course_announcements_status_idx',
      fields: ['status'],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'course_announcements',
      'course_announcements_course_idx'
    );
  } catch {}
  try {
    await qi.removeIndex(
      'course_announcements',
      'course_announcements_status_idx'
    );
  } catch {}
  try {
    await qi.dropTable('course_announcements');
  } catch {}
};
