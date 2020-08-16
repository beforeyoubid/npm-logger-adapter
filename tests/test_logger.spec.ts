import { logger } from '../src';

describe('Logger', () => {
  it('should be able to load module', () => {
    const objType = typeof logger;
    expect(objType).toEqual('object');
    expect(typeof logger.info).toEqual('function');
    expect(typeof logger.debug).toEqual('function');
  });
});
