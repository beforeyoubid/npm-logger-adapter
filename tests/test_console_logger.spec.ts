import { consoleLogger } from '../dist';

describe('Console Logger', () => {
  it('should be able to load module', () => {
    const objType = typeof consoleLogger;
    expect(objType).toEqual('object');
    expect(typeof consoleLogger.init).toEqual('function');
  });
});
