import winston from 'winston';

import { setupWinstonLogger } from '../../../src/logger/logger';

type ILogDNAParams = Parameters<typeof setupWinstonLogger>[0];

jest.mock('winston', () => ({
  ...jest.requireActual('winston'),
  createLogger: jest.fn(),
}));

describe('setupWinstonLogger', () => {
  let debugMock: jest.Mock;
  let addMock: jest.Mock;
  beforeAll(() => {
    debugMock = jest.fn();
    addMock = jest.fn();
    (winston.createLogger as jest.Mock).mockReturnValue({
      add: addMock,
      debug: debugMock,
    });
  });
  beforeEach(() => {
    debugMock.mockClear();
    addMock.mockClear();
  });
  it('should return logger', () => {
    const logger = setupWinstonLogger({} as ILogDNAParams);
    expect(logger).toEqual({
      add: addMock,
      debug: debugMock,
    });
  });
  describe('logdna transport', () => {
    describe('when keys provided', () => {
      it('should add the transport', () => {
        setupWinstonLogger({
          logDNAOptions: {
            key: Math.random().toString(),
          },
          logDNAKey: Math.random().toString(),
          sendToRemote: true,
        } as ILogDNAParams);
        expect(addMock).toHaveBeenCalled();
      });
    });
    describe('when keys not provided', () => {
      it('shouldnt add the transport', () => {
        setupWinstonLogger({
          logDNAOptions: {},
        } as ILogDNAParams);
        expect(addMock).not.toHaveBeenCalled();
      });
    });
  });
  describe('debug statement', () => {
    describe('when lambda function name in env variables', () => {
      beforeEach(() => {
        process.env.AWS_LAMBDA_FUNCTION_NAME = Math.random().toString();
      });
      it('should print disabled msg', () => {
        setupWinstonLogger({
          logDNAOptions: {},
        } as ILogDNAParams);
        expect(debugMock).toHaveBeenCalledWith('LOGDNA is disabled');
      });
    });
    describe('when lambda function name not in env variables', () => {
      beforeEach(() => {
        delete process.env.AWS_LAMBDA_FUNCTION_NAME;
      });
      it('should not print disabled msg', () => {
        setupWinstonLogger({
          logDNAOptions: {},
        } as ILogDNAParams);
        expect(debugMock).not.toHaveBeenCalledWith('LOGDNA is disabled');
      });
    });
  });
});
