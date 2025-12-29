import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { RpcController } from './common/rpc/rpc.controller';
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
      logging: devConfig.database.logging ? console.log : false,
    }),
    RpcModule,
    AuthModule,
    CourseModule,
    EnrollmentModule,
    AdminModule,
  ],
  controllers: [AppController, RpcController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AuthMiddleware, RateLimitMiddleware)
      .forRoutes(devConfig.backend.rpcPath);
  }
}
