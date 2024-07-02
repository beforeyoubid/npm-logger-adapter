import { getLogParams, sendToRemote } from '../params';

describe('Log Params', () => {
  it('return correct sendToRemote status', () => {
    let status;
    // LOGDNA_ENABLED is from env which is string
    status = sendToRemote('', 'true');
    expect(status).toEqual(false);

    status = sendToRemote('something', 'true');
    expect(status).toEqual(true);

    status = sendToRemote('something', 'false');
    expect(status).toEqual(false);
  });

  it('is able to set default logdna setting', () => {
    const simulatedEnv = {
      STAGE: 'sample',
      LOGDNA_KEY: '',
      LOGDNA_SUPPRESS_FLUSH_ALL: 'true',
    };
    const params = getLogParams(simulatedEnv);
    expect(params.logLevel).toEqual('info');
    expect(params.logDNASuppressFlushAll).toEqual(true);
    expect(params.functionName).toEqual('n/a');
    expect(params.logDNAOptions.env).toEqual('sample');
  });

  describe('sendToRemote', () => {
    it('should set sendToRemote to false when logdna_key is empty', () => {
      const simulatedEnv = {
        LOGDNA_KEY: '',
      };
      const params = getLogParams(simulatedEnv);
      expect(params.sendToRemote).toEqual(false);
    });

    it('should set sendToRemote to true when logdna_key presents & logdna is enabled', () => {
      const simulatedEnv = {
        LOGDNA_KEY: 'some-random-key',
        LOGDNA_ENABLED: 'true',
      };
      const params = getLogParams(simulatedEnv);
      expect(params.sendToRemote).toEqual(true);
    });
  });

  describe('sendToRemote', () => {
    it('should set sendToRemote to false when logdna_key is not set', () => {
      const simulatedEnv = {};
      const params = getLogParams(simulatedEnv);
      expect(params.sendToRemote).toEqual(false);
    });

    it('should set sendToRemote to false when logdna_key is empty', () => {
      const simulatedEnv = {
        LOGDNA_KEY: '',
      };
      const params = getLogParams(simulatedEnv);
      expect(params.sendToRemote).toEqual(false);
    });

    it('should set sendToRemote to true when logdna_key presents & logdna is enabled', () => {
      const simulatedEnv = {
        LOGDNA_KEY: 'some-random-key',
        LOGDNA_ENABLED: 'true',
      };
      const params = getLogParams(simulatedEnv);
      expect(params.sendToRemote).toEqual(true);
    });
  });

  describe('Validate logDNASuppressFlushAll', () => {
    it('should set logDNASuppressFlushAll to false by default', () => {
      const simulatedEnv = {};
      const params = getLogParams(simulatedEnv);
      expect(params.logDNASuppressFlushAll).toEqual(false);
    });

    it('should set logDNASuppressFlushAll to true when we supply env variable', () => {
      const simulatedEnv = {
        LOGDNA_SUPPRESS_FLUSH_ALL: 'true',
      };
      const params = getLogParams(simulatedEnv);
      expect(params.logDNASuppressFlushAll).toEqual(true);
    });
  });
});
