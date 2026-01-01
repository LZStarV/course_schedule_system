import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SystemRoleSeedService } from './services/system-role.seed';
import { AdminSeedService } from './services/admin.seed';
import { DepartmentsSeedService } from './services/departments.seed';
import { CoursesSeedService } from './services/courses.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly systemRoleSeed: SystemRoleSeedService,
    private readonly adminSeed: AdminSeedService,
    private readonly departmentsSeed: DepartmentsSeedService,
    private readonly coursesSeed: CoursesSeedService
  ) {}

  async run() {
    await this.ensurePrerequisites();
    await this.systemRoleSeed.run(this.sequelize);
    await this.adminSeed.run(this.sequelize);
    await this.departmentsSeed.run(this.sequelize);
    await this.coursesSeed.run(this.sequelize);
  }

  private async ensurePrerequisites() {
    const [exts] = await this.sequelize.query(
      `SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp','pgcrypto','pg_trgm')`
    );
    const extSet = new Set(
      (exts as any[]).map((e: any) => e.extname)
    );
    if (
      !extSet.has('uuid-ossp') ||
      !extSet.has('pgcrypto') ||
      !extSet.has('pg_trgm')
    ) {
      throw new Error(
        '缺少必须扩展，请先执行: pnpm --filter @apps/backend run migrate:dev'
      );
    }
    const requiredTables = [
      'system_configs',
      'users',
      'departments',
      'courses',
    ];
    for (const t of requiredTables) {
      const [rows] = await this.sequelize.query(
        `SELECT to_regclass(:tbl) AS exists`,
        { replacements: { tbl: t } }
      );
      const ok = (rows as any[])[0]?.exists;
      if (!ok) {
        throw new Error(
          `缺少数据表 ${t}，请先执行: pnpm --filter @apps/backend run migrate:dev`
        );
      }
    }
  }
}
