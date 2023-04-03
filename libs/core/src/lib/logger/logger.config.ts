import { ConfigurableModuleBuilder } from '@nestjs/common';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class LoggerServiceOption {
  @IsString()
  @IsDefined()
  consoleLevel: string;

  @IsBoolean()
  @IsDefined()
  consoleJSONFormat: boolean;
}
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<LoggerServiceOption>()
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
