export const up = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('semesters') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE semesters (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        academic_year VARCHAR(20) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        selection_start_date DATE,
        selection_end_date DATE,
        status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','ENDED','ARCHIVED')),
        is_current BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS semesters_status_idx ON semesters(status)`
  );
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS semesters_current_idx ON semesters(is_current)`
  );
};

export const down = async ({ context }: any) => {
  const sequelize = context?.sequelize ?? context;
  await sequelize.query(
    `DROP INDEX IF EXISTS semesters_status_idx`
  );
  await sequelize.query(
    `DROP INDEX IF EXISTS semesters_current_idx`
  );
  await sequelize.query(`DROP TABLE IF EXISTS semesters`);
};
