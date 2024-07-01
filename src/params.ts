import { type ILogDNAParams } from './types';

const getEnvs = (env = process?.env || {}) => {
  const {
    LOG_LEVEL = 'info',
    LOGDNA_KEY = '',
    STAGE = 'n/a',
    AWS_LAMBDA_FUNCTION_NAME = 'n/a',
    LOGDNA_ENABLED = 'true',
    LOGDNA_SUPPRESS_FLUSH_ALL = 'false',
  } = env;

  return {
    LOG_LEVEL,
    LOGDNA_KEY,
    STAGE,
    AWS_LAMBDA_FUNCTION_NAME,
    LOGDNA_ENABLED,
    LOGDNA_SUPPRESS_FLUSH_ALL,
  };
};

const sendToRemote = (logDNAKey: string, logDNAEnabled: string): boolean => {
  return !!logDNAKey && logDNAEnabled === 'true';
};

const getLogParams = (env = process?.env || {}): ILogDNAParams => {
  const { LOG_LEVEL, LOGDNA_KEY, STAGE, AWS_LAMBDA_FUNCTION_NAME, LOGDNA_ENABLED, LOGDNA_SUPPRESS_FLUSH_ALL } =
    getEnvs(env);

  const logDNAOptions = {
    key: LOGDNA_KEY,
    env: STAGE,
    app: AWS_LAMBDA_FUNCTION_NAME,
    hostname: STAGE,
    indexMeta: true,
    tags: [AWS_LAMBDA_FUNCTION_NAME, STAGE],
    level: LOG_LEVEL,
    handleExceptions: true,
  };

  return {
    logLevel: LOG_LEVEL,
    logDNAKey: LOGDNA_KEY,
    sendToRemote: sendToRemote(LOGDNA_KEY, LOGDNA_ENABLED),
    logDNASuppressFlushAll: LOGDNA_SUPPRESS_FLUSH_ALL === 'true',
    functionName: AWS_LAMBDA_FUNCTION_NAME,
    logDNAOptions,
  };
};

export { getLogParams, sendToRemote };
