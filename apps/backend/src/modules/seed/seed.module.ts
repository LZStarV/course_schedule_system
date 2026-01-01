import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeedService } from './seed.service';
import { SystemRoleSeedService } from './services/system-role.seed';
import { AdminSeedService } from './services/admin.seed';
import { DepartmentsSeedService } from './services/departments.seed';
import { CoursesSeedService } from './services/courses.seed';
import { BulkSeedService } from './services/bulk.seed';
import { FixedUsersSeedService } from './services/fixed-users.seed';

@Module({
  imports: [SequelizeModule],
  providers: [
    SeedService,
    SystemRoleSeedService,
    AdminSeedService,
    DepartmentsSeedService,
    CoursesSeedService,
    BulkSeedService,
    FixedUsersSeedService,
  ],
  exports: [
    SeedService,
    BulkSeedService,
    FixedUsersSeedService,
  ],
})
export class SeedModule {}
