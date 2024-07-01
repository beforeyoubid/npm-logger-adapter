import Transport from 'winston-transport';
import { Logger, createLogger } from '@logdna/logger';
//const pkg = require('./package.json');

/**
 * Support for Winston Transport
 * Functionality:
 *  This code is to extend Winston object and transport logs to LogDNA automatically.
 *  We need to build a custom transport because the original code doesn't support Lambda environment. See below
 *
 * Note:
 *  This code is cloned from the official LogDNA Winston transport (https://github.com/logdna/logdna-winston)
 *  This module has limited and doesn't fully support Lambda environment due to the fact that the logger object is
 *  created inside of the transport. This means that our ensureFlushAll() doesn't have a chance to clear its buffer
 *
 *  Someone reported the issue here - https://github.com/logdna/logdna-winston/issues/38
 *
 * Example of transport (https://github.com/winstonjs/winston-transport)
 */
export class LogDNATransport extends Transport {
  logger: Logger;
  constructor(options: any, suppliedLogdnaClient?: Logger) {
    const { levels, maxLevel, key, ...opts } = options;
    super({
      ...opts,
      levels,
      level: maxLevel,
    });

    let custom_levels = levels;
    if (!custom_levels) {
      // Per the winston docs, their 'npm' levels will be used, and those must be
      // set up as custom levels in LogDNA.
      // @see https://github.com/winstonjs/winston#logging-levels
      custom_levels = {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      };
    }

    // Using the supplied logger or create an instance of @logdna/logger
    this.logger =
      suppliedLogdnaClient ??
      createLogger(key, {
        ...opts,
        levels: Object.keys(custom_levels),
        UserAgent: 'byb-logger-adapter', //`${pkg.name}/${pkg.version}`,
      });
  }

  /**
   * Winston Transport will call this log function
   * @param info
   * @param callback
   * @returns
   */
  log(info: any, callback: (a: any, b: any) => void) {
    const level = info.level;

    if (info.error instanceof Error) {
      info.error = info.error.stack || info.error.toString();
    }

    if (!info.message) {
      // Send the incoming object payload as the message
      this.logger.log(info, level);
      callback(null, true);
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { message, indexMeta, timestamp, ...meta } = info;
    const opts = {
      level,
      indexMeta,
      timestamp,
      meta,
    };

    this.logger.log(message, opts);
    callback(null, true);
  }
}
