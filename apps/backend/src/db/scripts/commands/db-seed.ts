import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Sequelize } from 'sequelize-typescript';
import { SystemRoleSeedService } from '../../../modules/seed/services/system-role.seed';
import { AdminSeedService } from '../../../modules/seed/services/admin.seed';
import { DepartmentsSeedService } from '../../../modules/seed/services/departments.seed';
import { CoursesSeedService } from '../../../modules/seed/services/courses.seed';
import { createLogger } from '../../../common/logger';
import { FixedUsersSeedService } from '../../../modules/seed/services/fixed-users.seed';
import { SemestersSeedService } from '../../../modules/seed/services/semesters.seed';

const log = createLogger('db-cli');

async function main() {
  const app =
    await NestFactory.createApplicationContext(AppModule);
  const sequelize = app.get(Sequelize);
  const systemRole = app.get(SystemRoleSeedService);
  const admin = app.get(AdminSeedService);
  const departments = app.get(DepartmentsSeedService);
  const courses = app.get(CoursesSeedService);
  const fixed = app.get(FixedUsersSeedService);
  const semesters = app.get(SemestersSeedService);
  await systemRole.run(sequelize);
  await admin.run(sequelize);
  await departments.run(sequelize);
  await courses.run(sequelize);
  await fixed.run(sequelize);
  await semesters.run(sequelize);
  await app.close();
}

main().catch((e: any) => {
  log.error(e?.stack || String(e));
  process.exitCode = 1;
});
