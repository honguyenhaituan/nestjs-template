import { LoggerFactoryService } from '@portal-chat/core';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { AppConfig } from './shared/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app
    .get(LoggerFactoryService)
    .createLogger(`Socketer${AppModule.name}`);
  app.useLogger(logger);

  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new ResponseTransformerInterceptor(['/metrics']));
  // app.useGlobalPipes(
  //   new ValidationPipe({ whitelist: true, skipMissingProperties: true }),
  // );

  app.enableCors();

  const appConfig: AppConfig = app.get(AppConfig);
  const httpPort = appConfig.app.httpPort;
  const socketPort = appConfig.app.socketPort;
  await app.listen(httpPort);
  logger.log(`HTTP port: ${httpPort}; socket port: ${socketPort}`);
  logger.log(`Socketer application is running on: ${await app.getUrl()}`);
  process.on('uncaughtException', (err) => {
    logger.critical('socketer uncaught exception', err);
    process.exit(1);
  });
}

bootstrap();
