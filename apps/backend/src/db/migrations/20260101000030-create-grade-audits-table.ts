export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('grade_audits') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE grade_audits (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
        old_score DECIMAL,
        old_grade VARCHAR(10),
        new_score DECIMAL,
        new_grade VARCHAR(10),
        reason TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
        reviewed_at TIMESTAMP,
        reviewed_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS grade_audits_enrollment_idx ON grade_audits(enrollment_id)`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS grade_audits_status_idx ON grade_audits(status)`
  );
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    `DROP INDEX IF EXISTS grade_audits_enrollment_idx`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS grade_audits_status_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS grade_audits`
  );
};
