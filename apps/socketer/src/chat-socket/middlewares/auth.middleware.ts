import { Socket } from 'socket.io';

import { LoggerFactoryService, LoggerService } from '@portal-chat/core';

export class SocketAuthMiddleware {
  private readonly logger: LoggerService;

  constructor(loggerFactory: LoggerFactoryService) {
    this.logger = loggerFactory.createLogger(SocketAuthMiddleware.name);
  }

  authMiddleware = async (socket: Socket, next) => {
    // const token = socket.handshake?.auth?.token;
    next();
  };
}
