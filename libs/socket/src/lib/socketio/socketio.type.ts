import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IsDefined, IsInt } from 'class-validator';

export class SocketOptions {
  @IsInt()
  @IsDefined()
  websocketPort: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SocketOptions>()
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
