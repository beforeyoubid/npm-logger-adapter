import { ILogDNAParams } from '../types';
import winston from 'winston';
import { createLogDNAClient } from './logdnaClient';
import { LogDNATransport } from '../transports/logdnaWinston';
import { isLogDNAEnabled } from '../util';
const { format, transports } = winston;

const uppercaseLevel = format(info => {
  info.level = info.level.toUpperCase();
  return info;
});

const createWinstonLogger = (
  logLevel: string,
  defaultMeta?: Record<string, string>,
  consoleLevel?: string
): winston.Logger => {
  const logger = winston.createLogger({
    level: logLevel || 'info',
    defaultMeta,
    format: format.combine(format.timestamp(), uppercaseLevel(), format.json()),
    transports: [
      new transports.Console({
        level: consoleLevel || logLevel || 'info',
        handleExceptions: true,
        format: format.combine(format.timestamp(), uppercaseLevel(), format.json()),
      }),
    ],
    rejectionHandlers: [new transports.Console()],
  });
  return logger;
};

/**
 * Create a Winston logger with structured JSON output.
 * - Every log line is a valid JSON object queryable in CloudWatch and LogDNA.
 * - defaultMeta attaches service/env to every line automatically.
 * - Unhandled exceptions and promise rejections are captured automatically.
 * - Console and LogDNA transports can have independent log level thresholds.
 */
const setupWinstonLogger = (params: ILogDNAParams): winston.Logger => {
  const { AWS_LAMBDA_FUNCTION_NAME } = process.env;

  const { logLevel, consoleLevel, logDNAOptions, logDNAKey, sendToRemote, serviceName, stage } = params;
  const isEnabled = isLogDNAEnabled(logDNAKey, sendToRemote);

  const defaultMeta: Record<string, string> = {};
  if (serviceName) defaultMeta.service = serviceName;
  if (stage) defaultMeta.env = stage;

  const logger = createWinstonLogger(logLevel, Object.keys(defaultMeta).length ? defaultMeta : undefined, consoleLevel);

  if (isEnabled) {
    const logdnaClient = createLogDNAClient(params);
    logger.add(new LogDNATransport(logDNAOptions, logdnaClient));
  } else if (AWS_LAMBDA_FUNCTION_NAME !== undefined) {
    logger.debug(`LOGDNA is disabled`);
  }

  return logger;
};

export { setupWinstonLogger };
