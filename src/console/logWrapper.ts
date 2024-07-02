import { type Logger } from '@logdna/logger';

// Original console functions
const _log = console.log;
const _info = console.info;
const _warn = console.warn;
const _error = console.error;

const wrapAndSendToLogDNA = (logDNAClient: Logger, logLevel: string): void => {
  if (logLevel === 'debug') {
    _log('--------------------- Wrapping Console -----------------------');
  }

  const log = function (...args: any[]) {
    if (logLevel === 'debug') {
      logDNAClient?.debug && logDNAClient?.debug([...args].join(' '));
    }
    _log(...args);
  };

  const info = function (...args: any[]) {
    if (['debug', 'info'].indexOf(logLevel) !== -1) {
      logDNAClient?.info && logDNAClient?.info([...args].join(' '));
    }
    _info(...args);
  };

  const warn = function (...args: any[]) {
    logDNAClient?.warn && logDNAClient.warn([...args].join(' '));
    _warn(...args);
  };

  const error = function (...args: any[]) {
    logDNAClient?.error && logDNAClient.error([...args].join(' '));
    _error(...args);
  };

  // Override default functions with our wrapped functions
  console.log = log;
  console.debug = log;
  console.info = info;
  console.warn = warn;
  console.error = error;
};

const getDefaultConsoleLog = (): any => _log;

export { wrapAndSendToLogDNA, getDefaultConsoleLog };
