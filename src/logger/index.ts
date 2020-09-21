import { getLogParams } from '../params';
import { getLogger } from './logger';

const logParams = getLogParams();
const logger = getLogger(logParams);

export { logger };
