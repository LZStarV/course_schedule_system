import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('course_favorites') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('course_favorites', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: { type: DataTypes.UUID, allowNull: false },
      course_id: { type: DataTypes.UUID, allowNull: false },
      category: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
    await qi.addConstraint('course_favorites', {
      type: 'foreign key',
      name: 'fk_favorites_user',
      fields: ['user_id'],
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('course_favorites', {
      type: 'foreign key',
      name: 'fk_favorites_course',
      fields: ['course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('course_favorites', {
      type: 'unique',
      name: 'uq_favorites_user_course',
      fields: ['user_id', 'course_id'],
    });
  }
  try {
    await qi.addIndex('course_favorites', {
      name: 'course_favorites_user_idx',
      fields: ['user_id'],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'course_favorites',
      'course_favorites_user_idx'
    );
  } catch {}
  try {
    await qi.dropTable('course_favorites');
  } catch {}
};
