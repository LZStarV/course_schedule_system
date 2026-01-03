import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('schedule_change_requests') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('schedule_change_requests', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      course_id: { type: DataTypes.UUID, allowNull: false },
      teacher_id: { type: DataTypes.UUID, allowNull: true },
      old_day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      old_start_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      old_end_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      new_day_of_week: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      new_start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      new_end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      reason: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          'PENDING',
          'APPROVED',
          'REJECTED'
        ),
        allowNull: false,
        defaultValue: 'PENDING',
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    await qi.addConstraint('schedule_change_requests', {
      type: 'foreign key',
      name: 'fk_scr_course',
      fields: ['course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('schedule_change_requests', {
      type: 'foreign key',
      name: 'fk_scr_teacher',
      fields: ['teacher_id'],
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('schedule_change_requests', {
      type: 'foreign key',
      name: 'fk_scr_reviewed_by',
      fields: ['reviewed_by'],
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
  try {
    await qi.addIndex('schedule_change_requests', {
      name: 'schedule_change_requests_course_idx',
      fields: ['course_id'],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'schedule_change_requests',
      'schedule_change_requests_course_idx'
    );
  } catch {}
  try {
    await qi.dropTable('schedule_change_requests');
  } catch {}
};
