import LogDNALogger, { createLogger } from '@logdna/logger';
jest.mock('@logdna/logger', () => ({
  ...jest.requireActual('@logdna/logger'),
  createLogger: jest.fn(), // mock one specific function to observe behavior
}));
import { createLogDNAClient, isClientAvailable } from '../logdnaClient';
jest.mock('../logdnaClient', () => ({
  ...jest.requireActual('../logdnaClient'),
  isClientAvailable: jest.fn(),
}));
import type { ILogDNAParams } from '../../types';

describe('createLogDNAClient()', () => {
  const params = {
    logDNAKey: 'key',
    logDNAOptions: {},
  } as ILogDNAParams;
  const someClient = {} as LogDNALogger.Logger;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should be able to load module', () => {
    (createLogger as jest.Mock).mockReturnValue('' as unknown as LogDNALogger.Logger);
    createLogDNAClient(params);
    expect(createLogger).toHaveBeenCalledTimes(1);
  });

  it('should return the same object if get called multiple times', () => {
    (isClientAvailable as jest.Mock).mockReturnValueOnce(false);
    (createLogger as jest.Mock).mockReturnValue(someClient);
    createLogDNAClient(params);

    // Call again, it should not call createLogger() again
    createLogDNAClient(params);
    expect(createLogger).toHaveBeenCalledTimes(1);
  });
});
