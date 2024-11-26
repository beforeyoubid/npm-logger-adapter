import { MetricLogger } from '../index';
import type { BasicMetric, BasicMetricReq, BasicMetricRes } from '../types';
import { logger } from '../../logger';
jest.mock('../../logger', () => ({
  logger: {
    info: jest.fn(),
  },
}));

type MyReqMetric = BasicMetricReq & {
  userId: string;
};

type MyResMetric = BasicMetricRes & {
  count: number;
};

type MyMetric = BasicMetric & {
  req: MyReqMetric;
  res: MyResMetric;
};

type MyCustomMetric = {
  productType: string;
  count: number;
};

describe('MetricLogger', () => {
  const defaultMetric = {
    req: { type: 'myType', userId: 'my-user-id' },
    res: { isSuccessful: true, errorCode: '', count: 10 },
  };
  describe('setMetric() - extended metric type', () => {
    it('should set metric property', () => {
      const metricLogger = new MetricLogger<MyMetric>(defaultMetric, true, logger);

      const expectedUserId = 'another-user-id';
      const expectedResult = {
        ...defaultMetric,
        req: { ...defaultMetric.req, userId: expectedUserId },
      };
      metricLogger.setMetric('req.userId', expectedUserId);
      const result = metricLogger.getMetric();
      expect(result.req.userId).toEqual(expectedUserId);
      expect(result).toEqual(expectedResult);
    });

    it('should allow to set metrics', () => {
      const metricLogger = new MetricLogger<MyMetric>(defaultMetric, true, logger);

      const expectedUserId = 'another-user-id';
      const newCount = 20;
      const expectedResult = {
        req: { ...defaultMetric.req, userId: expectedUserId },
        res: { ...defaultMetric.res, count: newCount },
      };
      metricLogger.setMetric('req.userId', expectedUserId);
      metricLogger.setMetric('res.count', newCount);
      const result = metricLogger.getMetric();
      expect(result.req.userId).toEqual(expectedUserId);
      expect(result).toEqual(expectedResult);
    });

    it('should allow to set custom multi-layer metrics', () => {
      type MyMetricNestedLayer = MyMetric & {
        res: MyResMetric & {
          customObject: {
            someKey: string;
            someValue: string;
          };
        };
      };
      const nestedDefaultMetric = {
        ...defaultMetric,
        res: {
          ...defaultMetric.res,
          customObject: {
            someKey: 'some-key',
            someValue: 'some-value',
          },
        },
      };
      const metricLogger = new MetricLogger<MyMetricNestedLayer>(nestedDefaultMetric, true, logger);
      const expectedSomeKey = 'new-key';
      const expectedSomeValue = 'new-value';
      const expectedResult = {
        ...nestedDefaultMetric,
        res: {
          ...defaultMetric.res,
          customObject: {
            someKey: expectedSomeKey,
            someValue: expectedSomeValue,
          },
        },
      };
      metricLogger.setMetric('res.customObject.someKey', expectedSomeKey);
      metricLogger.setMetric('res.customObject.someValue', expectedSomeValue);
      const result = metricLogger.getMetric();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('setMetric() - custom metric type', () => {
    it('should be able to handle custom metric', () => {
      const myDefaultMetric = {
        productType: 'myType',
        count: 10,
      };
      const metricLogger = new MetricLogger<MyCustomMetric>(myDefaultMetric, true, logger);
      const expectedProductType = 'anotherType';
      const expectedCount = 100;
      metricLogger.setMetric('productType', expectedProductType);
      metricLogger.setMetric('count', expectedCount);
      const result = metricLogger.getMetric();
      expect(result.productType).toEqual(expectedProductType);
      expect(result.count).toEqual(expectedCount);
    });
  });

  describe('success()', () => {
    it('should set success response', () => {
      const metricLogger = new MetricLogger<MyMetric>(defaultMetric, true, logger);

      const expectedUserId = 'another-user-id';
      const expectedResult = {
        ...defaultMetric,
        req: { ...defaultMetric.req, userId: expectedUserId, isSuccessful: true, errorCode: '' },
      };
      metricLogger.setMetric('req.userId', expectedUserId);
      const result = metricLogger.getMetric();
      expect(result.req.userId).toEqual(expectedUserId);
      expect(result.res.isSuccessful).toEqual(expectedResult.res.isSuccessful);
      expect(result.res.errorCode).toEqual(expectedResult.res.errorCode);
    });
  });

  describe('error()', () => {
    it('should set error response', () => {
      const metricLogger = new MetricLogger<MyMetric>(defaultMetric, true, logger);

      const expectedUserId = 'another-user-id';
      const expectedResult = {
        req: { ...defaultMetric.req, userId: expectedUserId },
        res: { ...defaultMetric.res, isSuccessful: false, errorCode: 'some-error-code' },
      };
      metricLogger.error('some-error-code');
      metricLogger.setMetric('res.isSuccessful', false);
      const result = metricLogger.getMetric();
      expect(result.req.userId).toEqual(expectedUserId);
      expect(result.res.isSuccessful).toEqual(expectedResult.res.isSuccessful);
      expect(result.res.errorCode).toEqual(expectedResult.res.errorCode);
    });
  });
});
