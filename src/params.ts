import { ILogDNAParams } from './types';

const {
  LOG_LEVEL = 'info',
  LOGDNA_KEY = '',
  STAGE = 'n/a',
  AWS_LAMBDA_FUNCTION_NAME = 'n/a',
  LOGDNA_ENABLED = 'true',
} = process.env;

const logDNAOptions = {
  key: LOGDNA_KEY,
  env: STAGE,
  app: AWS_LAMBDA_FUNCTION_NAME,
  hostname: STAGE,
  index_meta: true,
  tags: [AWS_LAMBDA_FUNCTION_NAME, STAGE],
  handleExceptions: true,
};

const sendToRemote = (logDNAKey: string, logDNAEnabled: string): boolean => {
  return !!logDNAKey && logDNAEnabled === 'true';
};

const getLogParams = (): ILogDNAParams => {
  return {
    logLevel: LOG_LEVEL,
    logDNAKey: LOGDNA_KEY,
    sendToRemote: sendToRemote(LOGDNA_KEY, LOGDNA_ENABLED),
    functionName: AWS_LAMBDA_FUNCTION_NAME,
    logDNAOptions,
  };
};

export { getLogParams, sendToRemote };
