export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('class_schedules') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE class_schedules (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        weekday INTEGER NOT NULL CHECK (weekday >= 1 AND weekday <= 7),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        location TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS class_schedules_course_idx ON class_schedules(course_id)`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS class_schedules_weekday_idx ON class_schedules(weekday)`
  );
  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS class_schedules_unique ON class_schedules(course_id, weekday, start_time, end_time)`
  );
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    `DROP INDEX IF EXISTS class_schedules_unique`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS class_schedules_course_idx`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS class_schedules_weekday_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS class_schedules`
  );
};
