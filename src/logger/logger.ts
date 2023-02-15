import { ILogDNAParams } from '../types';
const logdnaWinston = require('logdna-winston');
const winston = require('winston');
const { isLogDNAEnabled } = require('../util');
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
  const { logLevel, logDNAOptions, logDNAKey, sendToRemote } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);
  const logger = createWinstonLogger(logLevel);
  if (isEnabled) {
    logger.add(new logdnaWinston(logDNAOptions));
  } else {
    // logger.info(`LOGDNA is disabled`);
  }
  return logger;
};

export { getLogger };
