import { ILogDNAParams } from '../types';

import { getLogParams } from '../params';
import { wrapAndSendToLogDNA } from './logWrapper';
import { isLogDNAEnabled, flushAll } from '../util';
import { createLogDNAClient } from '../logger/logdnaClient';
import { type Logger } from '@logdna/logger';

let hasWrapped: boolean = false;
const logParams = getLogParams();

/**
 * Initialise and wrap the native console log object
 * @param params
 */
const init = (params: ILogDNAParams = logParams): void => {
  if (hasWrapped) return;

  const { AWS_LAMBDA_FUNCTION_NAME } = process.env;
  const { logDNAKey, sendToRemote, logLevel } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);

  if (isEnabled) {
    // Create/reuse this logdna client instance so that we can use it in the console wrapper
    const logDNAClient = createLogDNAClient(params) as Logger;

    // Wrap console object and keep the status
    wrapAndSendToLogDNA(logDNAClient, logLevel);
    hasWrapped = true;
  }

  // What case is this?
  const isFunctionNameAvailable = AWS_LAMBDA_FUNCTION_NAME !== undefined;
  if (!isEnabled && isFunctionNameAvailable) {
    console.info(`LOGDNA is disabled`);
  }
};

const consoleLogger = {
  init,
  flushAll,
};

export { consoleLogger };
