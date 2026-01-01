import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export const up = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  const [existsRows]: any = await (
    queryInterface as any
  ).sequelize.query(
    `SELECT to_regclass('system_configs') AS exists`
  );
  if (existsRows?.[0]?.exists) {
    await (queryInterface as any).sequelize.query(
      `CREATE INDEX IF NOT EXISTS system_configs_key_idx ON system_configs (config_key)`
    );
    const [hasUnique]: any = await (
      queryInterface as any
    ).sequelize.query(
      `SELECT 1 FROM pg_constraint WHERE conname='system_configs_key_unique'`
    );
    if (!hasUnique?.length) {
      await (queryInterface as any).sequelize.query(
        `ALTER TABLE system_configs ADD CONSTRAINT system_configs_key_unique UNIQUE (config_key)`
      );
    }
    return;
  }
  await queryInterface.createTable('system_configs', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    config_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    module: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    config_value: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    value_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    scope: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    is_encrypted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    `CREATE INDEX IF NOT EXISTS system_configs_key_idx ON system_configs (config_key)`
  );
  await (queryInterface as any).sequelize.query(
    `ALTER TABLE system_configs ADD CONSTRAINT system_configs_key_unique UNIQUE (config_key)`
  );
};

export const down = async ({ context }: any) => {
  const queryInterface: QueryInterface =
    (context?.queryInterface ?? context) as any;
  await queryInterface.dropTable('system_configs');
};
