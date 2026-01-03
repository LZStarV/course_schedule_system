import { DataTypes, QueryInterface } from 'sequelize';

export const up = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  const sequelize =
    (qi as any).sequelize ?? context?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('grade_audits') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await qi.createTable('grade_audits', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      enrollment_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      old_score: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      old_grade: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      new_score: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      new_grade: {
        type: DataTypes.STRING(10),
        allowNull: true,
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
    await qi.addConstraint('grade_audits', {
      type: 'foreign key',
      name: 'fk_grade_audits_enrollment',
      fields: ['enrollment_id'],
      references: { table: 'enrollments', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await qi.addConstraint('grade_audits', {
      type: 'foreign key',
      name: 'fk_grade_audits_reviewed_by',
      fields: ['reviewed_by'],
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  }
  try {
    await qi.addIndex('grade_audits', {
      name: 'grade_audits_enrollment_idx',
      fields: ['enrollment_id'],
    });
  } catch {}
  try {
    await qi.addIndex('grade_audits', {
      name: 'grade_audits_status_idx',
      fields: ['status'],
    });
  } catch {}
};

export const down = async ({ context }: any) => {
  const qi: QueryInterface = (context?.queryInterface ??
    context) as any;
  try {
    await qi.removeIndex(
      'grade_audits',
      'grade_audits_enrollment_idx'
    );
  } catch {}
  try {
    await qi.removeIndex(
      'grade_audits',
      'grade_audits_status_idx'
    );
  } catch {}
  try {
    await qi.dropTable('grade_audits');
  } catch {}
};
