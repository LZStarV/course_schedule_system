import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('prerequisites') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('prerequisites', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      course_id: { type: DataTypes.UUID, allowNull: false },
      prerequisite_course_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    });
    await qi.addConstraint('prerequisites', {
      type: 'foreign key',
      name: 'fk_prerequisites_course',
      fields: ['course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('prerequisites', {
      type: 'foreign key',
      name: 'fk_prerequisites_prereq_course',
      fields: ['prerequisite_course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
  try {
    await qi.addIndex('prerequisites', {
      name: 'prerequisites_unique',
      unique: true,
      fields: ['course_id', 'prerequisite_course_id'],
    });
  } catch {}
  try {
    await qi.addIndex('prerequisites', {
      name: 'prerequisites_course_idx',
      fields: ['course_id'],
    });
  } catch {}
  try {
    await qi.addIndex('prerequisites', {
      name: 'prerequisites_prereq_course_idx',
      fields: ['prerequisite_course_id'],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'prerequisites',
      'prerequisites_unique'
    );
  } catch {}
  try {
    await qi.removeIndex(
      'prerequisites',
      'prerequisites_course_idx'
    );
  } catch {}
  try {
    await qi.removeIndex(
      'prerequisites',
      'prerequisites_prereq_course_idx'
    );
  } catch {}
  try {
    await qi.dropTable('prerequisites');
  } catch {}
};
