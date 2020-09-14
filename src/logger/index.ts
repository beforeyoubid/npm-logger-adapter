import { getLogParams } from '../params';
import { getLogger, getLogdnaTransport } from './logger';

const logParams = getLogParams();
const logger = getLogger(logParams);
const logdnaTransport = getLogdnaTransport();

export { logger, logdnaTransport };
