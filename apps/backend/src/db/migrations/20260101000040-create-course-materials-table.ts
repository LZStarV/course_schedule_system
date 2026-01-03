import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('course_materials') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('course_materials', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      course_id: { type: DataTypes.UUID, allowNull: false },
      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      file_url: { type: DataTypes.TEXT, allowNull: false },
      file_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      permissions: {
        type: DataTypes.ENUM(
          'PUBLIC',
          'PRIVATE',
          'RESTRICTED'
        ),
        allowNull: false,
        defaultValue: 'PUBLIC',
      },
      uploaded_by: {
        type: DataTypes.UUID,
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
    await qi.addConstraint('course_materials', {
      type: 'foreign key',
      name: 'fk_materials_course',
      fields: ['course_id'],
      references: { table: 'courses', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('course_materials', {
      type: 'foreign key',
      name: 'fk_materials_uploaded_by',
      fields: ['uploaded_by'],
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
  try {
    await qi.addIndex('course_materials', {
      name: 'course_materials_course_idx',
      fields: ['course_id'],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'course_materials',
      'course_materials_course_idx'
    );
  } catch {}
  try {
    await qi.dropTable('course_materials');
  } catch {}
};
