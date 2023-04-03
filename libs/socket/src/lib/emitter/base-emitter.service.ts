import { LoggerService } from '@portal-chat/core';
import { Emitter } from '@socket.io/redis-emitter';
import { DefaultEventsMap } from '@socket.io/redis-emitter/dist/typed-events';
import { classToPlain } from 'class-transformer';
import Redis from 'ioredis';

export abstract class BaseEmitter {
  protected logger: LoggerService;
  private emitter: Emitter<DefaultEventsMap>;

  protected constructor(redis: Redis, namespace: string) {
    const io = new Emitter(redis);
    this.emitter = io.of(namespace);
  }

  async broadcast(event: string, msg: any) {
    this.emitter.emit(event, msg);
  }

  async emitToChannel(channel: string, event: string, msg: any) {
    this.logger.debug('emit event', { channel, event, msg });
    this.emitter.to(channel).emit(event, classToPlain(msg));
  }
}
