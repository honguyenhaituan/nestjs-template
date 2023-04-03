import { Injectable } from '@nestjs/common';
import { Namespace, Server, Socket } from 'socket.io';

import { LoggerFactoryService, LoggerService } from '@portal-chat/core';
import { SocketIOService } from '@portal-chat/socket';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketAuthMiddleware } from './middlewares';

@Injectable()
export class ChatSocketService {
  private readonly logger: LoggerService;
  private readonly io: Server;
  private metaNamespace: Namespace<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;

  constructor(
    socketIOService: SocketIOService,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = this.loggerFactory.createLogger(ChatSocketService.name);
    this.io = socketIOService.getSocketIOServer();
    this.metaNamespace = this.io.of('ZPS_NAMESPACE');
    this.applyMiddleware();
    this.listen();
  }

  private applyMiddleware = () => {
    const authMiddleware = new SocketAuthMiddleware(this.loggerFactory);
    this.metaNamespace.use(authMiddleware.authMiddleware);
  };

  private listen = () => {
    this.metaNamespace.on('connection', async (socket) => {
      await this.onSocketDisconnection(socket);
      await this.onSocketConnection(socket);
    });
  };

  private async onSocketConnection(socket: Socket) {
    const claims = socket.handshake.auth?.claims;
    const userId = claims?.userId;
    // const req = socket.request;
    // this.logger.info(`user socket connected`, {
    //   socketId: socket.id,
    //   userId,
    //   request: {
    //     clientIp: req.headers['x-forwarded-for'] || req?.socket?.remoteAddress,
    //     referer: req.headers['referer'],
    //     userAgent: req.headers['user-agent'],
    //   },
    // });
    if (userId) {
      const personalChannel = 'personalChannel';
      socket.join(personalChannel);
    }

    socket.on('joinChannel', (channel) => {
      socket.join(channel);
      socket.to(channel).emit('userJoinRoom', 'ahuhu');
    });
  }

  private async onSocketDisconnection(socket: Socket) {
    const claims = socket.handshake.auth.claims;
    const userId = claims?.userId;

    // socket.on('disconnect', async (reason: string) => {
    //   this.logger.debug(`user socket disconnected`, {
    //     reason,
    //     userId,
    //   });
    // });
  }
}
