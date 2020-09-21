import { LambdaHandlerWithAsyncFunction, LambdaHandlerWithCallbackFunction, CallbackFunction } from './types';
import { logger } from './logger';

const debug = require('util').debuglog('logger-adapter');
const { once } = require('events')
const { FALLBACK_TIMEOUT_AFTER_FLUSHING } = require('./consts');
const { getLogParams } = require('./params');

// timeout
let timeout: NodeJS.Timeout;

/**
 * REturn if we need to suppress flushAll on a local machine
 */
export const suppressFlushAll = (): boolean => getLogParams()?.logDNASuppressFlushAll || false;

export const sleep = (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));

/**
 * Send all log messages to LogDNA before lambda is terminated
 */
export const flushAll = async (): Promise<void> => {
  debug('Flushing all logs...');
  logger.flush()
  await once(logger, 'cleared')
  // Everything clear.  Did Lambda buffer anything?
  await sleep(1000);
  logger.flush()
  await once(logger, 'cleared')
  if (timeout) {
    clearTimeout(timeout);
  }
  debug('Completed flushing all log messages');
};

/**
 * Fallback promise just in
 */
export const timeoutPromise = () => {
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
export const ensureFlushAll = (lambdaHandler: LambdaHandlerWithAsyncFunction): LambdaHandlerWithAsyncFunction => {
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
export const ensureFlushAllCallback = (
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