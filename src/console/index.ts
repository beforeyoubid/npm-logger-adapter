import { ILogDNAParams } from '../types';

import { getLogParams } from '../params';
import { getLogger } from './logger';
import { isLogDNAEnabled, flushAll } from '../util';

let loggerObject: any;
const logParams = getLogParams();

/**
 * Initialise and wrap the native console object
 * @param params
 */
const init = (params: ILogDNAParams = logParams): void => {
  // If has wrapped already, don't do it again
  if (!!loggerObject) return;

  const { logDNAKey, sendToRemote } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);

  // Wrap console object
  loggerObject = isEnabled ? getLogger(params) : {};
  if (!isEnabled) {
    console.info(`LOGDNA is disabled`);
  }
};

const consoleLogger = {
  init,
  flushAll,
};

export { consoleLogger };
