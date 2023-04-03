import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IsBoolean, IsDefined, IsInt, IsString } from 'class-validator';
import Redis from 'ioredis';

export type RedisClient = Redis;

export class RedisConfig {
  @IsInt()
  @IsDefined()
  port: number;

  @IsString()
  @IsDefined()
  host: string;

  @IsInt()
  @IsDefined()
  db: number;

  @IsString()
  @IsDefined()
  password: string;

  @IsInt()
  // @IsDefined()
  connectTimeout: number;

  @IsBoolean()
  @IsDefined()
  enableReadyCheck: boolean;

  @IsBoolean()
  @IsDefined()
  showFriendlyErrorStack: boolean;

  // @IsBoolean()
  // lazyConnect?: boolean;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<RedisConfig>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();
