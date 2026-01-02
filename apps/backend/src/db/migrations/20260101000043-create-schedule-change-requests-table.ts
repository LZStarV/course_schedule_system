export const up = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('schedule_change_requests') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE schedule_change_requests (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        teacher_id UUID REFERENCES users(id),
        old_day_of_week INTEGER,
        old_start_time TIME,
        old_end_time TIME,
        new_day_of_week INTEGER NOT NULL,
        new_start_time TIME NOT NULL,
        new_end_time TIME NOT NULL,
        reason TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
        reviewed_at TIMESTAMP,
        reviewed_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS schedule_change_requests_course_idx ON schedule_change_requests(course_id)`
  );
};

export const down = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  await sequelize.query(
    `DROP INDEX IF EXISTS schedule_change_requests_course_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS schedule_change_requests`
  );
};
