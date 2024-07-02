import { logger } from '../index';

describe('Logger', () => {
  it('should be able to load module', () => {
    const objType = typeof logger;
    expect(objType).toEqual('object');
    expect(typeof logger.info).toEqual('function');
    expect(typeof logger.debug).toEqual('function');
  });

  it('should not prefix my Winston logger', () => {
    const spy = jest.spyOn(logger, 'debug');
    logger.debug('my log message');
    expect(spy).toHaveBeenCalledWith('my log message');
  });
});
