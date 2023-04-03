import { Inject, Injectable } from '@nestjs/common';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';

import { MODULE_OPTIONS_TOKEN, SocketOptions } from './socketio.type';

import Redis from 'ioredis';
import { App } from 'uWebSockets.js';

@Injectable()
export class SocketIOService {
  private readonly io: Server;

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) socketOptions: SocketOptions,
    private readonly redisClient: Redis,
  ) {
    this.io = this.initIOServer(socketOptions.websocketPort);
    const pubClient = this.redisClient.duplicate();
    const subClient = pubClient.duplicate();
    this.io.adapter(createAdapter(pubClient, subClient));
  }

  private initIOServer(websocketPort: number): Server {
    const app = App({});
    const io = new Server();

    io.attachApp(app, {
      cors: {
        origin: '*',
        credentials: true,
      },
      transports: ['websocket'],
      // httpCompression: false,
    });
    app.listen(websocketPort, (token) => {
      if (!token) {
        console.warn('port already in use');
      }
    });
    return io;
    // return new Server(websocketPort, {
    //   cors: {
    //     origin: '*',
    //     credentials: true,
    //   },
    //   transports: ['websocket'],
    //   httpCompression: false,
    // });
  }

  getSocketIOServer(): Server {
    return this.io;
  }
}
