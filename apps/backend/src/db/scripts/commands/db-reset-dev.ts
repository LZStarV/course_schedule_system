import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Sequelize } from 'sequelize-typescript';
import { createLogger } from '../../../common/logger';

const log = createLogger('db-cli');

async function main() {
  const app = await NestFactory.createApplicationContext(
    AppModule,
    {
      logger: false,
    }
  );
  const sequelize = app.get(Sequelize);
  // 仅开发环境保护（根据 devConfig 端口等条件，可进一步加锁）
  await sequelize.query(`
    DO $$ BEGIN
    -- 按依赖顺序清理
    PERFORM 1;
    END $$;
  `);
  const tables = [
    'enrollments',
    'class_schedules',
    'prerequisites',
    'courses',
    'users',
    'departments',
  ];
  for (const t of tables) {
    try {
      await sequelize.query(
        `TRUNCATE TABLE ${t} RESTART IDENTITY CASCADE`
      );
    } catch (e) {
      log.warn(
        { table: t },
        'truncate failed or table not exists'
      );
    }
  }
  log.info('truncate done');
  await app.close();
}

main().catch(e => {
  log.error(e?.stack || String(e));
  process.exitCode = 1;
});
