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

let logdnaTransport: any;

const getLogger = (params: ILogDNAParams): any => {
  const { logLevel, logDNAOptions, logDNAKey, sendToRemote } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);
  const logger = createWinstonLogger(logLevel);
  logdnaTransport = new logdnaWinston(logDNAOptions);
  if (isEnabled) {
    logger.add(logdnaTransport);
  } else {
    logger.info(`LOGDNA is disabled`);
  }
  return logger;
};

const getLogdnaTransport = () => logdnaTransport;

export { getLogger, getLogdnaTransport };
