import { LambdaHandlerWithAsyncFunction, LambdaHandlerWithCallbackFunction, CallbackFunction } from './types';

//const LogDNALogger = require('@logdna/logger');
import { getLogDNAClient } from './logger/logdnaClient';
const debug = require('util').debuglog('logger-adapter');
const { FALLBACK_TIMEOUT_AFTER_FLUSHING } = require('./consts');
const { getLogParams } = require('./params');
import { once } from 'events';

// timeout
let timeout: NodeJS.Timeout | null = null;

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
 * Support an async function
 */
const flushAll = async (): Promise<void> => {
  return new Promise(async resolve => {
    debug('Flushing all logs...');
    const logger = getLogDNAClient();
    if (!logger) return;

    const before = Date.now();
    // Wait until LogDNA emitter flushes all logs, then resolve
    // The default flushing interval is 250ms
    await once(logger, 'cleared');
    debug(`Flushing all logs done in ${Date.now() - before}ms`);
    timeout && clearTimeout(timeout);
    resolve();
  });
};

/**
 * Try to clear all logs before the Lambda function is terminated (support callback pattern)
 *
 * @returns
 */
const flushAllCallback = (): void => {
  debug('Flushing all logs...');
  const logger = getLogDNAClient();
  if (!logger) return;

  // Calling flush() manually here to avoid relying on the async event
  // https://www.npmjs.com/package/@logdna/logger#loggerflush
  logger.flush();
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
      if (!suppressFlushAll()) flushAllCallback();
    };
    lambdaHandler(event, context, thisCallback);
  };
};

export { isLogDNAEnabled, flushAll, ensureFlushAll, ensureFlushAllCallback };
