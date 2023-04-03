import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let mockLogger;
  let loggerService: LoggerService;

  beforeEach(() => {
    mockLogger = {
      critical: jest.fn(),
      warning: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };
    loggerService = new LoggerService(mockLogger);
  });

  it('should resolve metadata from error, array and object', () => {
    const message = 'mock message';
    const error = new Error('error message');
    const arrayData = ['1', '2'];
    const stringData = 'data';
    const objectData = { foo: 'bar', foo1: 'bar1' };
    loggerService.info(message, arrayData, stringData, objectData, error);
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
    expect(mockLogger.info).toHaveBeenCalledWith(message, {
      '0': arrayData[0],
      '1': arrayData[1],
      foo: 'bar',
      foo1: 'bar1',
      error: {
        ...error,
        stack: error.stack,
      },
    });
  });

  it('should not resolve metadata from nested object', () => {
    const message = 'message';
    const nestedObjectData = {
      context: 'context',
      userIds: ['1', '2'],
      room: {
        id: 'roomId',
        owner: 'owner',
        members: ['1', '2', '3'],
      },
    };
    loggerService.warn(message, nestedObjectData);
    expect(mockLogger.warning).toHaveBeenCalledTimes(1);
    expect(mockLogger.warning).toHaveBeenCalledWith(message, {
      context: nestedObjectData.context,
      userIds: nestedObjectData.userIds,
      room: nestedObjectData.room,
    });
  });
});
