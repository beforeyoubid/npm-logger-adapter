import { logger } from './index';

const toString = (args: unknown[]) => {
  return args.map(arg => JSON.stringify(arg)).join(' ');
};

const getPrefix = (prefix: string) => (prefix && `${prefix}: `) || '';

/**
 * A utility command to return a logger with a prefix on log line.
 * @param prefix string
 */
const getLoggerObject = (prefix = '') => {
  const debug = (...args: unknown[]) => logger.debug(`${getPrefix(prefix)}${toString(args)}`);
  const info = (...args: unknown[]) => logger.info(`${getPrefix(prefix)}${toString(args)}`);
  const warn = (...args: unknown[]) => logger.warn(`${getPrefix(prefix)}${toString(args)}`);
  const error = (...args: unknown[]) => logger.error(`${getPrefix(prefix)}${toString(args)}`);
  return { debug, info, warn, error };
};

export { getLoggerObject };
