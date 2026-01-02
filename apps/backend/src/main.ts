import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { devConfig } from '@packages/config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RpcDiscoveryProvider } from './common/rpc/rpc.discovery';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: devConfig.frontend.baseUrl,
    credentials: true,
    methods: devConfig.backend.allowedMethods,
    allowedHeaders: devConfig.backend.allowedHeaders,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app
    .get(RpcDiscoveryProvider)
    .onApplicationBootstrap();
  await app.listen(devConfig.backend.port);
}

bootstrap();
