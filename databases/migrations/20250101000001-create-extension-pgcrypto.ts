import type { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "pgcrypto"');
  },
};
