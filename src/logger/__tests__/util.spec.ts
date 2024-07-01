jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  isLogDNAEnabled: () => false,
}));
import { logger } from '../index';
import { getLoggerObject } from '../util';

describe('getLoggerObject', () => {
  it('should prefix my log object', () => {
    const spy = jest.spyOn(logger, 'debug');
    const testLoggerObject = getLoggerObject('[MY-PREFIX]');
    testLoggerObject.debug('my log message');
    expect(spy).toHaveBeenCalledWith('[MY-PREFIX]: "my log message"');
  });

  it('should not prefix my log object if I leave it empty', () => {
    const spy = jest.spyOn(logger, 'debug');
    const testLoggerObject = getLoggerObject();
    testLoggerObject.debug('my log message');
    expect(spy).toHaveBeenCalledWith('"my log message"');
  });
});
