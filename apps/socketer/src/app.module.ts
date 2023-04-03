import { Module } from '@nestjs/common';

import { HealthCheckModule, LoggerFactoryModule } from '@portal-chat/core';
import { RedisModule } from '@portal-chat/database';
import { SocketIOModule } from '@portal-chat/socket';
import { ChatSocketModule } from './chat-socket';
import { AppConfig, AppConfigModule } from './shared/config';

@Module({
  imports: [
    AppConfigModule,
    RedisModule.registerAsync({
      isGlobal: true,
      useFactory: (appConfig: AppConfig) => appConfig.redis,
      inject: [AppConfig],
    }),
    HealthCheckModule,
    LoggerFactoryModule.registerAsync({
      isGlobal: true,
      useFactory: (appConfig: AppConfig) => appConfig.log,
      inject: [AppConfig],
    }),
    SocketIOModule.registerAsync({
      isGlobal: true,
      useFactory: (appConfig: AppConfig) => ({
        websocketPort: appConfig.app.socketPort,
      }),
      inject: [AppConfig],
    }),
    ChatSocketModule,
  ],
})
export class AppModule {}
