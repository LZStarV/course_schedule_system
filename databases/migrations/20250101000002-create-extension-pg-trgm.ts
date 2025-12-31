import type { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pg_trgm"'
    );
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
      'DROP EXTENSION IF EXISTS "pg_trgm"'
    );
  },
};
