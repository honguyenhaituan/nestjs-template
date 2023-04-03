import { Global, Module } from '@nestjs/common';

import { loggerFactoryWrapper } from './logger-factory.instance';
import { LoggerFactoryService } from './logger-factory.service';
import { ConfigurableModuleClass } from './logger.config';
import { DUMP_LOGGER_PROVIDER } from './logger.constant';

@Global()
@Module({
  providers: [
    LoggerFactoryService,
    {
      provide: DUMP_LOGGER_PROVIDER,
      useFactory: (loggerFactory: LoggerFactoryService) => {
        loggerFactoryWrapper.init(loggerFactory);
        return true;
      },
      inject: [LoggerFactoryService],
    },
  ],
  exports: [LoggerFactoryService],
})
export class LoggerFactoryModule extends ConfigurableModuleClass {}
