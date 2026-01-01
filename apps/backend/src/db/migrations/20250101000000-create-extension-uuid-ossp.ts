export const up = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
  );
};

export const down = async ({ context }: any) => {
  const qi = context?.queryInterface ?? context;
  const sequelize = context?.sequelize ?? qi?.sequelize;
  await sequelize.query(
    'DROP EXTENSION IF EXISTS "uuid-ossp"'
  );
};
