export type BasicRecord = Record<string, unknown>;

export type BasicMetricReq = BasicRecord & {
  type: string;
};

export type BasicMetricRes = BasicRecord & {
  isSuccessful: boolean;
  errorCode: string;
};

export type BasicMetric = {
  req: BasicMetricReq;
  res: BasicMetricRes;
};
