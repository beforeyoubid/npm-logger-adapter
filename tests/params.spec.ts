import { getLogParams } from '../dist';

describe('Log Params', () => {
  it('validate interface', () => {
    const params = getLogParams();
    expect(params.logLevel).toEqual('info');
    expect(params.logDNAKey).toEqual('');
  });
});
