import { Module } from '@nestjs/common';

import { SocketIOService } from './socketio.service';
import { ConfigurableModuleClass } from './socketio.type';

@Module({
  providers: [SocketIOService],
  exports: [SocketIOService],
})
export class SocketIOModule extends ConfigurableModuleClass {}
