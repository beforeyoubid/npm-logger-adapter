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

  describe('Handle multiple loggers', () => {
    it('should be able to handle multiple loggers with correct prefix', () => {
      const spy = jest.spyOn(logger, 'debug');
      const testLoggerObject1 = getLoggerObject('[MY-PREFIX-1]');
      testLoggerObject1.debug('my log message');
      expect(spy).toHaveBeenCalledWith('[MY-PREFIX-1]: "my log message"');
      spy.mockReset();

      const spy2 = jest.spyOn(logger, 'info');
      const testLoggerObject2 = getLoggerObject('[MY-PREFIX-2]');
      testLoggerObject2.info('my log message');
      expect(spy2).toHaveBeenCalledWith('[MY-PREFIX-2]: "my log message"');

      // try again on debug
      const spy3 = jest.spyOn(logger, 'debug');
      testLoggerObject1.debug('another log on the original logger');
      expect(spy3).toHaveBeenCalledWith('[MY-PREFIX-1]: "another log on the original logger"');
    });
  });
});
