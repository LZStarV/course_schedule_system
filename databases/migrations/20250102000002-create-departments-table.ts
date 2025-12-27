import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('departments', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      full_name: { type: DataTypes.STRING(200), allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      parent_id: { type: DataTypes.UUID, allowNull: true },
      level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      path: { type: DataTypes.STRING(500), allowNull: true },
      contact_person: { type: DataTypes.STRING(50), allowNull: true },
      contact_phone: { type: DataTypes.STRING(20), allowNull: true },
      contact_email: { type: DataTypes.STRING(100), allowNull: true },
      location: { type: DataTypes.STRING(200), allowNull: true },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      display_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      created_by: { type: DataTypes.UUID, allowNull: true },
      updated_by: { type: DataTypes.UUID, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('departments', ['code'], {
      name: 'departments_code_unique',
      unique: true,
    });
    await queryInterface.addIndex('departments', ['parent_id'], {
      name: 'departments_parent_id_idx',
    });
    await queryInterface.addIndex('departments', ['path'], { name: 'departments_path_idx' });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('departments');
  },
};
