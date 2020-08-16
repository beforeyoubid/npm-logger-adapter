import { getLogParams, sendToRemote } from '../dist/params';

describe('Log Params', () => {
  it('return correct sendToRemote status', () => {
    let status;
    // LOGDNA_ENABLED is from env which is string
    status = sendToRemote('', 'true');
    expect(status).toEqual(false);

    status = sendToRemote('something', 'true');
    expect(status).toEqual(true);

    status = sendToRemote('something', 'false');
    expect(status).toEqual(false);
  });

  it('validate interface', () => {
    const params = getLogParams();
    expect(params.logLevel).toEqual('info');
    expect(params.logDNAKey).toEqual('');
  });
});
