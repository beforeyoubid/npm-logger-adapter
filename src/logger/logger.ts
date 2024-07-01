import { ILogDNAParams } from '../types';
import winston from 'winston';
import { createLogDNAClient } from './logdnaClient';
import { LogDNATransport } from '../transports/logdnaWinston';
import { isLogDNAEnabled } from '../util';
const { format, transports } = winston;

const createWinstonLogger = (logLevel: string): winston.Logger => {
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

/**
 * Create a Winston logger object so that we can get a few benefits
 * 1. We can use the same logger to output logs to console. If we use logger from @logdna/logger, it won't show up locally
 * 2. We can also format the colour of the log lines so that it's easier to read in the local docker container
 * 3. We can use the same logger object and send logs to logDNA using transports mechanism
 *
 * @param params
 * @returns
 */
const setupWinstonLogger = (params: ILogDNAParams): winston.Logger => {
  const { AWS_LAMBDA_FUNCTION_NAME } = process.env;

  const { logLevel, logDNAOptions, logDNAKey, sendToRemote } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);
  const logger = createWinstonLogger(logLevel);

  if (isEnabled) {
    const logdnaClient = createLogDNAClient(params);
    logger.add(new LogDNATransport(logDNAOptions, logdnaClient));
  } else if (AWS_LAMBDA_FUNCTION_NAME !== undefined) {
    logger.debug(`LOGDNA is disabled`);
  }

  return logger;
};

export { setupWinstonLogger };
