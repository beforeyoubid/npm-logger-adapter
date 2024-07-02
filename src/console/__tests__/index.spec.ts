jest.mock('../logWrapper.ts');
jest.mock('../../logger/logdnaClient.ts');
import { consoleLogger } from '../index';
import * as logWrapper from '../logWrapper';
jest.mock('../../util', () => ({
  isLogDNAEnabled: () => true,
}));

describe('consoleLogger.init()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should not wrap the console logger if we do not call init', () => {
    const spy = jest.spyOn(logWrapper, 'wrapAndSendToLogDNA');
    expect(spy).not.toHaveBeenCalled();
  });

  it('should wrap console log if we enable it', () => {
    const spy = jest.spyOn(logWrapper, 'wrapAndSendToLogDNA');
    consoleLogger.init();
    expect(spy).toHaveBeenCalled();
  });
});
