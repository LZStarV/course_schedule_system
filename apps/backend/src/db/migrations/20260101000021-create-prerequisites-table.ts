export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('prerequisites') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE prerequisites (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        prerequisite_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE
      )
    `);
  }
  await sequelize.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS prerequisites_unique ON prerequisites(course_id, prerequisite_course_id)`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS prerequisites_course_idx ON prerequisites(course_id)`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS prerequisites_prereq_course_idx ON prerequisites(prerequisite_course_id)`
  );
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    `DROP INDEX IF EXISTS prerequisites_unique`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS prerequisites_course_idx`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS prerequisites_prereq_course_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS prerequisites`
  );
};
