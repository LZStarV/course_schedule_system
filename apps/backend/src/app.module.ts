import {
  Module,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { RpcAliasController } from './common/rpc/rpc.alias.controller';
import { RpcModule } from './common/rpc/rpc.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { devConfig } from '@packages/config';
import { AuthModule } from './modules/auth/auth.module';
import { CourseModule } from './modules/course/course.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { AdminModule } from './modules/admin/admin.module';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { SeedModule } from './modules/seed/seed.module';
import { MaterialModule } from './modules/material/material.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';
import { GradeAuditModule } from './modules/grade-audit/grade-audit.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { TeachingScheduleModule } from './modules/teaching-schedule/teaching-schedule.module';
import { SemesterModule } from './modules/semester/semester.module';
import { StatsSystemModule } from './modules/stats-system/stats-system.module';
import { StatsTeachingModule } from './modules/stats-teaching/stats-teaching.module';
import { StatsUsersModule } from './modules/stats-users/stats-users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: devConfig.database.host,
      port: devConfig.database.port,
      username: devConfig.database.user,
      password: devConfig.database.password,
      database: devConfig.database.name,
      autoLoadModels: true,
      synchronize: false,
      define: { underscored: true },
      timezone: '+08:00',
      logging: devConfig.database.logging
        ? console.log
        : false,
    }),
    RpcModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    AdminModule,
    SeedModule,
    MaterialModule,
    SystemSettingsModule,
    GradeAuditModule,
    FavoritesModule,
    AnnouncementsModule,
    TeachingScheduleModule,
    SemesterModule,
    StatsSystemModule,
    StatsTeachingModule,
    StatsUsersModule,
  ],
  controllers: [AppController, RpcAliasController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        LoggerMiddleware,
        AuthMiddleware,
        RateLimitMiddleware
      )
      .forRoutes(devConfig.backend.apiPrefix);
  }
}
