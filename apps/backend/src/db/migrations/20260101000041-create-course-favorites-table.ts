export const up = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('course_favorites') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE course_favorites (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, course_id)
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS course_favorites_user_idx ON course_favorites(user_id)`
  );
};

export const down = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  await sequelize.query(
    `DROP INDEX IF EXISTS course_favorites_user_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS course_favorites`
  );
};
