import { ILogDNAParams } from '../types';
const LogDNALogger = require('@logdna/logger');
const { flushAll } = require('../util');
let logger: any;

// Default console
const _log = console.log;
const _info = console.info;
const _warn = console.warn;
const _error = console.error;

const wrapConsole = (logger: any, logLevel: string): void => {
  _log('--------------------- Wrapping Console -----------------------');

  const log = function (...args: any[]) {
    if (logLevel === 'debug') {
      logger.debug([...args].join(' '));
    }
    _log(...args);
  };

  const info = function (...args: any[]) {
    if (['debug', 'info'].indexOf(logLevel) !== -1) {
      logger.info([...args].join(' '));
    }
    _info(...args);
  };

  const warn = function (...args: any[]) {
    logger.warn([...args].join(' '));
    _warn(...args);
  };

  const error = function (...args: any[]) {
    logger.error([...args].join(' '));
    _error(...args);
  };

  console.log = log;
  console.debug = log;
  console.info = info;
  console.warn = warn;
  console.error = error;
};

const getLogger = (params: ILogDNAParams): any => {
  const { logDNAKey, logLevel, logDNAOptions } = params;

  logger = LogDNALogger.setupDefaultLogger(logDNAKey, logDNAOptions);

  // Wrap default
  wrapConsole(logger, logLevel);

  // Attach flushAll
  logger.flushAll = flushAll;

  return logger;
};

const getDefaultConsoleLog = (): any => _log;

export { getLogger, getDefaultConsoleLog };
