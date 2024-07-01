jest.mock('../../util', () => ({
  ...jest.requireActual('../../util'),
  isLogDNAEnabled: () => false,
}));
import { logger } from '../index';
import { getLoggerObject } from '../util';

describe('getLoggerObject', () => {
  it('should prefix my logger object - debug', () => {
    const spy = jest.spyOn(logger, 'debug');
    const testLoggerObject = getLoggerObject('[MY-PREFIX]');
    testLoggerObject.debug('my log message');
    expect(spy).toHaveBeenCalledWith('[MY-PREFIX]: "my log message"');
  });

  it('should prefix my logger object - info', () => {
    const spy = jest.spyOn(logger, 'info');
    const testLoggerObject = getLoggerObject('[MY-PREFIX]');
    testLoggerObject.info('my log message');
    expect(spy).toHaveBeenCalledWith('[MY-PREFIX]: "my log message"');
  });

  it('should prefix my logger object - warn', () => {
    const spy = jest.spyOn(logger, 'warn');
    const testLoggerObject = getLoggerObject('[MY-PREFIX]');
    testLoggerObject.warn('my log message');
    expect(spy).toHaveBeenCalledWith('[MY-PREFIX]: "my log message"');
  });

  it('should prefix my logger object - error', () => {
    const spy = jest.spyOn(logger, 'error');
    const testLoggerObject = getLoggerObject('[MY-PREFIX]');
    testLoggerObject.error('my log message');
    expect(spy).toHaveBeenCalledWith('[MY-PREFIX]: "my log message"');
  });

  it('should not prefix my log object if I leave it empty', () => {
    const spy = jest.spyOn(logger, 'debug');
    const testLoggerObject = getLoggerObject();
    testLoggerObject.debug('my log message');
    expect(spy).toHaveBeenCalledWith('"my log message"');
  });
});
