export const up = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('course_announcements') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE course_announcements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(50),
        status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT','PUBLISHED','ARCHIVED')),
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS course_announcements_course_idx ON course_announcements(course_id)`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS course_announcements_status_idx ON course_announcements(status)`
  );
};

export const down = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  await sequelize.query(
    `DROP INDEX IF EXISTS course_announcements_course_idx`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS course_announcements_status_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS course_announcements`
  );
};
