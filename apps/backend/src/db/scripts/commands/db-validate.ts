import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Sequelize } from 'sequelize-typescript';

async function main() {
  const app =
    await NestFactory.createApplicationContext(AppModule);
  const sequelize = app.get(Sequelize);
  const check = async (sql: string) =>
    (await sequelize.query(sql))[0];
  const [exts] = await sequelize.query(
    `SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp','pgcrypto','pg_trgm')`
  );
  const hasExt = ['uuid-ossp', 'pgcrypto', 'pg_trgm'].every(
    e => (exts as any[]).some((x: any) => x.extname === e)
  );
  const tables = [
    'users',
    'departments',
    'courses',
    'enrollments',
    'system_configs',
  ];
  const hasTables = (
    await Promise.all(
      tables.map(t =>
        check(`SELECT to_regclass('${t}') AS exists`)
      )
    )
  ).every(rows => (rows as any[])[0]?.exists);
  const [triggers] = await sequelize.query(
    `SELECT tgname FROM pg_trigger WHERE tgname IN ('update_users_updated_at','update_courses_updated_at','update_enrollments_updated_at')`
  );
  const hasTriggers = [
    'update_users_updated_at',
    'update_courses_updated_at',
    'update_enrollments_updated_at',
  ].every(t =>
    (triggers as any[]).some((x: any) => x.tgname === t)
  );
  console.log(
    JSON.stringify(
      { hasExt, hasTables, hasTriggers },
      null,
      2
    )
  );
  await app.close();
}

main().catch(() => {
  process.exitCode = 1;
});
