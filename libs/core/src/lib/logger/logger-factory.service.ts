import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';

import {
  LoggerServiceOption as LoggerFactoryOption,
  MODULE_OPTIONS_TOKEN,
} from './logger.config';
import { DEFAULT_OPTIONS, GcloudLoggingLevel } from './logger.constant';
import { LoggerService } from './logger.service';
import { plainLogFormat, severityFormat } from './logger.util';

@Injectable()
export class LoggerFactoryService {
  logger: winston.Logger;

  constructor(@Inject(MODULE_OPTIONS_TOKEN) options: LoggerFactoryOption) {
    if (options.consoleJSONFormat === undefined) {
      options.consoleJSONFormat = DEFAULT_OPTIONS.consoleJSONFormat;
    }
    if (!options.consoleLevel) {
      options.consoleLevel = DEFAULT_OPTIONS.consoleLevel;
    }
    this.logger = winston.createLogger({
      levels: GcloudLoggingLevel,
      level: options.consoleLevel,
      format: winston.format.combine(
        winston.format.timestamp({}),
        severityFormat(),
        options.consoleJSONFormat ? winston.format.json() : plainLogFormat,
      ),
      transports: [new winston.transports.Console()],
    });
  }

  createLogger(caller: string): LoggerService {
    return new LoggerService(this.logger.child({ caller: caller }));
  }
}
