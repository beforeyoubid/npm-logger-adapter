import { LambdaHandlerWithAsyncFunction, LambdaHandlerWithCallbackFunction, CallbackFunction } from './types';

const LogDNALogger = require('logdna');
const debug = require('util').debuglog('logger-adapter');
const { FALLBACK_TIMEOUT_AFTER_FLUSHING } = require('./consts');
const { getLogParams } = require('./params');

// timeout
let timeout: NodeJS.Timeout;

/**
 * Handy function to check if we are sending to LogDNA
 * @param logDNAKey
 * @param sendToRemote
 */
const isLogDNAEnabled = (logDNAKey: string, sendToRemote: boolean): boolean => !!logDNAKey && sendToRemote;

/**
 * REturn if we need to suppress flushAll on a local machine
 */
const suppressFlushAll = (): boolean => getLogParams()?.logDNASuppressFlushAll || false;

/**
 * Send all log messages to LogDNA before lambda is terminated
 */
const flushAll = async (): Promise<void> => {
  return new Promise(resolve => {
    debug('Flushing all logs...');
    LogDNALogger.flushAll(() => {
      debug('Completed flushing all log messages');
      if (timeout) {
        clearTimeout(timeout);
      }
      resolve();
    });
  });
};

/**
 * Fallback promise just in
 */
const timeoutPromise = (): Promise<void> => {
  return new Promise(resolve => {
    timeout = setTimeout(() => {
      debug('Flushing timeout has reached. Ignore flushing messages...');
      resolve();
    }, FALLBACK_TIMEOUT_AFTER_FLUSHING);
  });
};

/**
 * Lambda wrapper to ensure we flush messages before returning the response
 * @param lambdaHandler
 */
const ensureFlushAll = (lambdaHandler: LambdaHandlerWithAsyncFunction): LambdaHandlerWithAsyncFunction => {
  return async (event: any, context: any): Promise<any> => {
    try {
      const result = await lambdaHandler(event, context);
      if (!suppressFlushAll()) await Promise.race([flushAll(), timeoutPromise()]);
      return result;
    } catch (e) {
      if (!suppressFlushAll()) await Promise.race([flushAll(), timeoutPromise()]);
      throw e;
    }
  };
};

/**
 * A Lambda wrapper to ensure we flush messages before a Lambda function get terminated
 * NOTE: For non-async handlers, AWS Lambda will wait until the event loop is completed.
 * This means after a callback function is called, a Lambda function still run
 * and we can catch the final clean up.
 * REF: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * @param lambdaHandler
 */
const ensureFlushAllCallback = (
  lambdaHandler: LambdaHandlerWithCallbackFunction
): LambdaHandlerWithCallbackFunction => {
  return (event: any, context: any, callback: CallbackFunction): void => {
    const thisCallback = (error: any, result: any): void => {
      callback(error, result);
      if (!suppressFlushAll()) flushAll();
    };
    lambdaHandler(event, context, thisCallback);
  };
};

export { isLogDNAEnabled, flushAll, ensureFlushAll, ensureFlushAllCallback };
