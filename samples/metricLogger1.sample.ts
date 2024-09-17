import { ensureFlushAll, logger, MetricLogger } from '../src';

const yourHandler = async () => {
  // Normal string log message
  logger.info('some string goes here');

  // 1) Define your custom metric logger object, you can define your own metric format
  const metric = {
    req: { type: 'myType', userId: 'my-user-id' },
    res: { isSuccessful: false, errorCode: '', value: 10 },
  };

  // 2) Create a new instance of MetricLogger
  const metricLogger = new MetricLogger<typeof metric>(metric);

  // 3) Set any metric value to your metric object
  metricLogger.setMetric('res.value', 20);
  metricLogger.setMetric('res.isSucccessful', true);

  // 4) Send the metric to Mezmo, this will be logged as a JSON object
  // Should send once per execution to avoid duplicate metric
  metricLogger.sendMetric(metric);
};

// Example if you use Metric Logger in your handler
export default ensureFlushAll(yourHandler);
