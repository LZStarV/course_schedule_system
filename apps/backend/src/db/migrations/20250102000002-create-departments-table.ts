import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export const up = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  const [existsRows]: any = await (
    queryInterface as any
  ).sequelize.query(
    `SELECT to_regclass('departments') AS exists`
  );
  if (existsRows?.[0]?.exists) {
    await (queryInterface as any).sequelize.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS departments_code_unique ON departments (code)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS departments_parent_id_idx ON departments (parent_id)`
    );
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS departments_path_idx ON departments (path)`
    );
    return;
  }
  await queryInterface.createTable('departments', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parent_id: { type: DataTypes.UUID, allowNull: true },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    contact_person: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
    display_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_by: { type: DataTypes.UUID, allowNull: true },
    updated_by: { type: DataTypes.UUID, allowNull: true },
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
    `CREATE UNIQUE INDEX IF NOT EXISTS departments_code_unique ON departments (code)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS departments_parent_id_idx ON departments (parent_id)`
  );
  await (queryInterface as any).sequelize.query(
    `CREATE INDEX IF NOT EXISTS departments_path_idx ON departments (path)`
  );
};

export const down = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  await queryInterface.dropTable('departments');
};
