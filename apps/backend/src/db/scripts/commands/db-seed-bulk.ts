import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Sequelize } from 'sequelize-typescript';
import { BulkSeedService } from '../../../modules/seed/services/bulk.seed';
import { createLogger } from '../../../common/logger';
import fs from 'fs';
import path from 'path';

const log = createLogger('db-cli');

async function main() {
  const app = await NestFactory.createApplicationContext(
    AppModule,
    {
      logger: false,
    }
  );
  const sequelize = app.get(Sequelize);
  const svc = app.get(BulkSeedService);
  const cfg = resolveConfig();
  log.info({ cfg }, 'bulk seed config');
  await svc.run(sequelize, cfg);
  await app.close();
}

function resolveConfig() {
  const fixed = path.join(
    process.cwd(),
    'apps/backend/src/modules/seed/bulk-seed.config.json'
  );
  try {
    const txt = fs.readFileSync(fixed, 'utf-8');
    return JSON.parse(txt);
  } catch {}
  return {
    departmentsCount: 20,
    teachersPerDept: 30,
    studentsPerDept: 400,
    coursesPerDeptPerTerm: 60,
    academicYears: ['2024-2025', '2025-2026'],
    semesters: ['FALL', 'SPRING'],
    enrollmentsPerStudent: 6,
    skipIfDataExists: true,
  };
}

main().catch(e => {
  log.error(e?.stack || String(e));
  process.exitCode = 1;
});
