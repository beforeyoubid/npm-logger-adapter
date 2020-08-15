export {};
declare global {
  type EmptyCBFunction = () => void;
  type CallbackFunction = (err: any, data: any) => void;
  type LambdaHandlerWithAsyncFunction = (event: any, context: any) => Promise<any>;
  type LambdaHandlerWithCallbackFunction = (event: any, context: any, fn: CallbackFunction) => Promise<any>;
  interface ILogDNALogOptions {
    key: string;
    env: string;
    app: string;
    hostname: string;
    index_meta: boolean;
    tags: Array<string>;
    handleExceptions: boolean;
  }

  interface ILogDNAParams {
    logLevel: string;
    logDNAKey: string;
    sendToRemote: boolean;
    functionName: string;
    logDNAOptions: ILogDNALogOptions;
  }
}
