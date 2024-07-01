import { getLogParams } from '../params';
import { setupWinstonLogger } from './logger';

const logParams = getLogParams();

// Create a singleton logger object during module initialisation
const logger = setupWinstonLogger(logParams);

export { logger };
