import type { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS users_real_name_trgm_idx ON users USING gin (real_name gin_trgm_ops)'
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS courses_name_trgm_idx ON courses USING gin (name gin_trgm_ops)'
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS courses_schedule_idx ON courses USING gin (schedule)'
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS courses_restrictions_idx ON courses USING gin (restrictions)'
    );

    await queryInterface.sequelize.query(
      `CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql';`
    );
    await queryInterface.sequelize.query(
      'CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    );
    await queryInterface.sequelize.query(
      'CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    );
    await queryInterface.sequelize.query(
      'CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    );
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS update_users_updated_at ON users');
    await queryInterface.sequelize.query(
      'DROP TRIGGER IF EXISTS update_courses_updated_at ON courses'
    );
    await queryInterface.sequelize.query(
      'DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments'
    );
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS update_updated_at_column()');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS users_real_name_trgm_idx');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS courses_name_trgm_idx');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS courses_schedule_idx');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS courses_restrictions_idx');
  },
};
