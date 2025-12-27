import type { QueryInterface } from 'sequelize';
import { DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      phone: { type: DataTypes.STRING(20), allowNull: true },
      real_name: { type: DataTypes.STRING(50), allowNull: false },
      avatar_url: { type: DataTypes.STRING(500), allowNull: true },
      gender: {
        type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER', 'SECRET'),
        allowNull: false,
        defaultValue: 'SECRET',
      },
      birth_date: { type: DataTypes.DATEONLY, allowNull: true },
      student_id: { type: DataTypes.STRING(20), allowNull: true, unique: true },
      teacher_id: { type: DataTypes.STRING(20), allowNull: true, unique: true },
      department_id: { type: DataTypes.UUID, allowNull: true },
      major: { type: DataTypes.STRING(100), allowNull: true },
      grade: { type: DataTypes.INTEGER, allowNull: true },
      class_name: { type: DataTypes.STRING(50), allowNull: true },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      role: {
        type: DataTypes.ENUM('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'GRADUATED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      last_login_at: { type: DataTypes.DATE, allowNull: true },
      failed_login_attempts: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      locked_until: { type: DataTypes.DATE, allowNull: true },
      created_by: { type: DataTypes.UUID, allowNull: true },
      updated_by: { type: DataTypes.UUID, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    });

    await queryInterface.addIndex('users', ['username'], {
      name: 'users_username_unique',
      unique: true,
    });
    await queryInterface.addIndex('users', ['email'], { name: 'users_email_unique', unique: true });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
  },
};
