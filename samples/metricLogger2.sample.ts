import { ensureFlushAll, logger, MetricLogger } from '../src';

const yourHandler = async () => {
  // Normal string log message
  logger.info('some string goes here');

  // 1) Define your custom metric logger object, you can define your own metric format
  const metric = {
    type: 'email',
    status: 'send',
    emailType: 'receipt',
  };

  // 2) Create a new instance of MetricLogger
  const metricLogger = new MetricLogger<typeof metric>(metric);

  // 3) Set any metric value to your metric object
  metricLogger.setMetric('status', 'ignore');

  // 4) Send the metric to Mezmo, this will be logged as a JSON object
  // Should send once per execution to avoid duplicate metric
  metricLogger.sendMetric();
};

// Example if you use Metric Logger in your handler
export default ensureFlushAll(yourHandler);
