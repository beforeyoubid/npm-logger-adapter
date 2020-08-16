export type EmptyCBFunction = () => void;
export type CallbackFunction = (err: any, data: any) => void;
export type LambdaHandlerWithAsyncFunction = (event: any, context: any) => Promise<any>;
export type LambdaHandlerWithCallbackFunction = (event: any, context: any, fn: CallbackFunction) => void;
export interface ILogDNALogOptions {
  key: string;
  env: string;
  app: string;
  hostname: string;
  index_meta: boolean;
  tags: Array<string>;
  handleExceptions: boolean;
}

export interface ILogDNAParams {
  logLevel: string;
  logDNAKey: string;
  sendToRemote: boolean;
  functionName: string;
  logDNAOptions: ILogDNALogOptions;
}
