const LogDNALogger = require('logdna');
const debug = require('util').debuglog('logger-adapter');

/**
 * Handy function to check if we are sending to LogDNA
 * @param logDNAKey
 * @param sendToRemote
 */
const isLogDNAEnabled = (logDNAKey: string, sendToRemote: boolean): boolean => !!logDNAKey && sendToRemote;

/**
 * Send all log messages to LogDNA before lambda is terminated
 */
const flushAll = async (): Promise<void> => {
  return new Promise(resolve => {
    debug('Flushing all logs');
    LogDNALogger.flushAll(() => {
      debug('Completed flushing all log messages');
      resolve();
    });
  });
};

/**
 * Lambda wrapper to ensure we flush message before returning the response
 * @param lambdaHandler
 */
const ensureFlushAll = (lambdaHandler: any) => {
  return async (event: any, context: any) => {
    try {
      const result = await lambdaHandler(event, context);
      await flushAll();
      return result;
    } catch (e) {
      await flushAll();
      throw e;
    }
  };
};

export { isLogDNAEnabled, flushAll, ensureFlushAll };
