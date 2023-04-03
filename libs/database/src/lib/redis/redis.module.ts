import { Global, Module } from '@nestjs/common';
import Redis from 'ioredis';

import {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  RedisConfig,
} from './redis.type';

@Global()
@Module({
  providers: [
    {
      provide: Redis,
      useFactory: (redisConfig: RedisConfig): Redis => {
        return new Redis(redisConfig);
      },
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [Redis],
})
export class RedisModule extends ConfigurableModuleClass {}
