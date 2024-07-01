import LogDNALogger, { type ConstructorOptions } from '@logdna/logger';
import { type ILogDNAParams } from '../types';

// A singleton object in this module
let logdnaClient: LogDNALogger.Logger;

/**
 * Create one single instance of LogDNA (Mezmo) client so it can be shared/used in two cases
 * 1) Use it with the console wrapper. We send anything from console.log(), console.info(), console.error()
 *    to LogDNA for backward compatibility. Consumer can use this by calling consoleLogger.init()
 * 2) Use it with a Winston logger as part of the transports to send logs to LogDNA
 *
 * Before calling this function, make sure we check if LogDNA is enabled before creating it
 *
 * @param params
 * @returns
 */
export const createLogDNAClient = (params: ILogDNAParams): LogDNALogger.Logger => {
  if (logdnaClient) return logdnaClient;

  const { logDNAKey, logDNAOptions } = params;
  const { env, app, tags, level } = logDNAOptions;
  const options: ConstructorOptions = {
    env,
    app,
    hostname: env,
    indexMeta: true,
    tags,
    level,
  };

  // Create a new LogDNA client
  logdnaClient = LogDNALogger.createLogger(logDNAKey, options);
  return logdnaClient;
};

/**
 * Return the singleton instance of LogDNA client created by createLogDNAClient()
 * @returns
 */
export const getLogDNAClient = (): LogDNALogger.Logger => {
  return logdnaClient;
};
