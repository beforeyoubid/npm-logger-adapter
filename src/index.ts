import { consoleLogger } from './console';
import { logger } from './logger';
import { getLoggerObject } from './logger/util';
import { getLogParams } from './params';
import { flushAll, ensureFlushAll, ensureFlushAllCallback } from './util';

// Export all the functions
export { consoleLogger, logger, getLoggerObject, getLogParams, flushAll, ensureFlushAll, ensureFlushAllCallback };
