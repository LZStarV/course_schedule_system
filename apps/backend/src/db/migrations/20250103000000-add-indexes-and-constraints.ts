export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    'CREATE INDEX IF NOT EXISTS users_real_name_trgm_idx ON users USING gin (real_name gin_trgm_ops)'
  );
  await sequelize.query(
    'CREATE INDEX IF NOT EXISTS courses_name_trgm_idx ON courses USING gin (name gin_trgm_ops)'
  );
  await sequelize.query(
    'CREATE INDEX IF NOT EXISTS courses_schedule_idx ON courses USING gin (schedule)'
  );
  await sequelize.query(
    'CREATE INDEX IF NOT EXISTS courses_restrictions_idx ON courses USING gin (restrictions)'
  );
  await sequelize.query(`CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE 'plpgsql';`);
  const [tgUsers]: any = await sequelize.query(
    `SELECT 1 FROM pg_trigger WHERE tgname='update_users_updated_at'`
  );
  if (!tgUsers?.length) {
    await sequelize.query(
      'CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    );
  }
  const [tgCourses]: any = await sequelize.query(
    `SELECT 1 FROM pg_trigger WHERE tgname='update_courses_updated_at'`
  );
  if (!tgCourses?.length) {
    await sequelize.query(
      'CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    );
  }
  const [tgEnrollments]: any = await sequelize.query(
    `SELECT 1 FROM pg_trigger WHERE tgname='update_enrollments_updated_at'`
  );
  if (!tgEnrollments?.length) {
    await sequelize.query(
      'CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()'
    );
  }
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    'DROP TRIGGER IF EXISTS update_users_updated_at ON users'
  );
  await sequelize.query(
    'DROP TRIGGER IF EXISTS update_courses_updated_at ON courses'
  );
  await sequelize.query(
    'DROP TRIGGER IF EXISTS update_enrollments_updated_at ON enrollments'
  );
  await sequelize.query(
    'DROP FUNCTION IF EXISTS update_updated_at_column()'
  );
  await sequelize.query(
    'DROP INDEX IF EXISTS users_real_name_trgm_idx'
  );
  await sequelize.query(
    'DROP INDEX IF EXISTS courses_name_trgm_idx'
  );
  await sequelize.query(
    'DROP INDEX IF EXISTS courses_schedule_idx'
  );
  await sequelize.query(
    'DROP INDEX IF EXISTS courses_restrictions_idx'
  );
};
