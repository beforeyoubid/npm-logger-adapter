import winston from 'winston';
import { logger } from '../logger';

export class MetricLogger<T> {
  private _logger: winston.Logger;
  private _metric: T;
  private _isTest: boolean;
  constructor(private readonly defaultMetric: T = {} as T, _isTest = false, suppliedLogger?: winston.Logger) {
    this._metric = defaultMetric;
    this._isTest = _isTest;
    this._logger = suppliedLogger || logger;
  }

  getMetric(): T {
    return this._metric;
  }

  /**
   * Trigger to send log message over the supplied logger object
   * @param metric
   * @param stringifiedMetric
   */
  sendLog(metric: T, stringifiedMetric = true): void {
    if (!this._isTest) {
      const metricToSend = stringifiedMetric ? JSON.stringify(metric) : metric;
      this._logger.info(metricToSend);
    }
  }

  /**
   * Dynamically set the metric, support the dot notation e.g. `setMetric('res.isSuccess', true)`
   * @param key
   * @param value
   */
  setMetric(key: string, value: unknown) {
    const keys = key.split('.');
    let parentObject = this._metric;
    for (let i = 0; i < keys.length; i++) {
      const leafNode = i === keys.length - 1;
      const objectExists = typeof parentObject[keys[i]] !== undefined;

      // If not a leaf node and the object does not exist, set parent object so we can keep traversing through themn
      if (objectExists && !leafNode) {
        parentObject = parentObject[keys[i]];
      }

      if (leafNode) {
        parentObject[keys[i]] = value;
        break;
      }
    }
  }

  /**
   * Capture the success
   * @param cachedResponse
   * @returns
   */
  success() {
    this.setMetric('res.errorCode', '');
    return this.sendLog(this.getMetric());
  }

  /**
   * Capture the error
   * @param cached
   * @returns
   */
  error(errorCode: string = '') {
    this.setMetric('res.errorCode', errorCode);
    return this.sendLog(this.getMetric());
  }
}
