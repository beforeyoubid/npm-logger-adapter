import { ILogDNAParams } from '../types';
const logdnaWinston = require('logdna-winston');
import winston from 'winston';
import { isLogDNAEnabled } from '../util';
const { format, transports } = winston;

const createWinstonLogger = (logLevel: string) => {
  const logger = winston.createLogger({
    level: logLevel || 'info',
    format: format.combine(
      format.timestamp(),
      format.simple(),
      format.printf((info: any) => `${info.timestamp} - ${info.level}: ${info.message}`)
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.simple(),
          format.printf((info: any) => `${info.timestamp} - ${info.level}: ${info.message}`),
          format.colorize({ all: true })
        ),
      }),
    ],
  });
  return logger;
};

const getLogger = (params: ILogDNAParams): any => {
  const { AWS_LAMBDA_FUNCTION_NAME } = process.env;

  const { logLevel, logDNAOptions, logDNAKey, sendToRemote } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);
  const logger = createWinstonLogger(logLevel);
  if (isEnabled) {
    logger.add(new logdnaWinston(logDNAOptions));
  } else if (AWS_LAMBDA_FUNCTION_NAME !== undefined) {
    logger.debug(`LOGDNA is disabled`);
  }

  return logger;
};

export { getLogger };
