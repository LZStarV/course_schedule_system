export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  const [exists]: any = await sequelize.query(
    `SELECT to_regclass('course_materials') AS ok`
  );
  if (!exists?.[0]?.ok) {
    await sequelize.query(`
      CREATE TABLE course_materials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_size INTEGER NOT NULL,
        category VARCHAR(50),
        description TEXT,
        permissions VARCHAR(20) DEFAULT 'PUBLIC' CHECK (permissions IN ('PUBLIC','PRIVATE','RESTRICTED')),
        uploaded_by UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS course_materials_course_idx ON course_materials(course_id)`
  );
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    `DROP INDEX IF EXISTS course_materials_course_idx`
  );
  await sequelize.query(
    `DROP TABLE IF EXISTS course_materials`
  );
};
