import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';

import { LoggerServiceOption } from '@portal-chat/core';
import { ServerOption } from '@portal-chat/microservice';
import { RedisConfig } from '@portal-chat/database';

export class AppConfig {
  @ValidateNested()
  @Type(() => ServerOption)
  @IsDefined()
  app: ServerOption;

  @ValidateNested()
  @Type(() => LoggerServiceOption)
  @IsDefined()
  log: LoggerServiceOption;

  @ValidateNested()
  @Type(() => RedisConfig)
  @IsDefined()
  redis: RedisConfig;

  public constructor(init?: Partial<AppConfig>) {
    Object.assign(this, init);
  }
}
