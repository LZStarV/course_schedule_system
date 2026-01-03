import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('class_schedules') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('class_schedules', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      course_id: { type: DataTypes.UUID, allowNull: false },
      weekday: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: { type: DataTypes.TIME, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: true },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    await qi.addConstraint('class_schedules', {
      type: 'foreign key',
      name: 'fk_class_schedules_course',
      fields: ['course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    // weekday 范围检查：Sequelize 对复杂 CHECK 支持有限，保持 minimal raw SQL
    await sequelize.query(
      `ALTER TABLE class_schedules ADD CONSTRAINT ck_class_schedules_weekday CHECK (weekday >= 1 AND weekday <= 7)`
    );
  }
  try {
    await qi.addIndex('class_schedules', {
      name: 'class_schedules_course_idx',
      fields: ['course_id'],
    });
  } catch {}
  try {
    await qi.addIndex('class_schedules', {
      name: 'class_schedules_weekday_idx',
      fields: ['weekday'],
    });
  } catch {}
  try {
    await qi.addIndex('class_schedules', {
      name: 'class_schedules_unique',
      unique: true,
      fields: [
        'course_id',
        'weekday',
        'start_time',
        'end_time',
      ],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'class_schedules',
      'class_schedules_unique'
    );
  } catch {}
  try {
    await qi.removeIndex(
      'class_schedules',
      'class_schedules_course_idx'
    );
  } catch {}
  try {
    await qi.removeIndex(
      'class_schedules',
      'class_schedules_weekday_idx'
    );
  } catch {}
  try {
    await qi.dropTable('class_schedules');
  } catch {}
};
