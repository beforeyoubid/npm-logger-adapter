import { logger } from './index';
import { WrappedLogger } from '../types';
type LogFunction = (...args: unknown[]) => void;

const logFunctionsToWrap = ['debug', 'info', 'warn', 'error', 'xxxx'];

const toString = (args: unknown[]) => {
  return args.map(arg => JSON.stringify(arg)).join(' ');
};

const getPrefix = (prefix: string) => (prefix && `${prefix}: `) || '';

/**
 * A utility command to return a logger with a prefix on log line.
 * @param prefix string
 */
const getLoggerObject = (prefix = '') => {
  const wrappedLogger = {} as WrappedLogger;
  for (let functionName of logFunctionsToWrap) {
    wrappedLogger[functionName] = (...args: unknown[]) =>
      (logger[functionName] as LogFunction)(`${getPrefix(prefix)}${toString(args)}`);
  }
  return wrappedLogger;
};

export { getLoggerObject };
