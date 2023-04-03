import { readAndValidateEnv } from '@portal-chat/core';
import { Global, Module } from '@nestjs/common';

import { AppConfig } from './app.config';

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useValue: readAndValidateEnv(AppConfig, [
        'config/config.yaml',
        'apps/socketer/config.yaml',
      ]),
    },
  ],
  exports: [AppConfig],
})
export class AppConfigModule {}
