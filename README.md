# LogDNA Logger Adapter

This is a platform logger module that is able to support multiple logging scenarios.

- A `console` log wrapper so it can send all logs from the native `console` object to LogDNA.
- A Winston log wrapper logger which output better colour and we can send log messages to LogNDA.

This module is designed to work on normal runtime and Lambda environment. For lambda, please see the `Flushall Messages`
section.

## Console Logger vs. Winston Logger

- Dispite that `console.log()` is not a recommended approach to be used for frontend application but it's fine to use in
  the backend. Here are some limitations:
  - The native `console` log object doesn't support the `LOG_LEVEL`. For example, you may not want `console.debug()` to
    show debugging info on a production server.
  - Doesn't support log colour
  - Doesn't show datetime which is hard to make sense of
  - Doesn't support to send log to external services
- Console Logger wraps over the existing `console` object as a pathway to adopting a `logger` object.
  - Log levels
  - Send to external service
- Winston Logger solves all limitations described above

If you are using `console.log` on the existing code base and not ready to switch to Winston logger just yet, this module
can also helps you out as well.

## 1) Use Console Logger

```
  yarn add @beforeyoubid/logger-adapter
```

### Activate it

We follow 12-factors and we can enable and send log to LogDNA by supplying LOGDNA_KEY as part of the environment
variables.

```
  LOGDNA_KEY=xxxxxxyyyyyyyzzzzzzz
```

Please note that on your local, you can set `LOGDNA_KEY=` to disable sending logs to LogDNA. Supply `LOG_LEVEL` as part
of the environment variable.

### For a non-lambda environment

```
    import { consoleLogger } from '@beforeyoubid/console-logger-adapter';
    consoleLogger.init();

    // Don't need to call consoleLogger.flushAll(), logdna object has default flush interval interval at 250ms
```

### Lambda: Use with an Aync Handler

```
  import { consoleLogger } from '@beforeyoubid/console-logger-adapter';
  consoleLogger.init();

  // Ensure the we flush all messages before Lambda function gets terminated
  const yourLambdaHandler = async (event, context) => {
    try {
      console.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = await yourNormalProcess();

      await consoleLogger.flushAll(); // Trigger to flush all messages

      return result;
    } catch (e) {
      // handle error
      await consoleLogger.flushAll(); // Trigger to flush all messages

      // Throw or send result as usual
      throw e;

      // Or handle it nicely
      // return unsuccessfulResponse;
    }
  }

```

### Lambda: Use with a Callback Handler

```
  import { consoleLogger } from '@beforeyoubid/console-logger-adapter';
  consoleLogger.init();

  const yourLambdaHandler = (event, context, callback) => {
    try {
      console.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = yourNormalProcess();

      await consoleLogger.flushAll(); // Trigger to flush all messages

      callback(null, yourNormalResponseObject);
    } catch (e) {

      // Ensure the we flush all messages before Lambda function gets terminated
      await consoleLogger.flushAll(); // Trigger to flush all messages

      // Call a callback with error
      callback(yourErrorObject);

      // Or return unsuccessful response
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
      // callback(null, unsuccessfulResponse);
    }
  }

```

## 2) Use Winston Logger

```
  yarn add @beforeyoubid/logger-adapter
```

### Activate it

We follow 12-factors and we can enable and send log to LogDNA by supplying LOGDNA_KEY as part of the environment
variables.

```
  LOGDNA_KEY=xxxxxxyyyyyyyzzzzzzz
```

Please note that on your local, you can set `LOGDNA_KEY=` to disable sending logs to LogDNA. Supply `LOG_LEVEL` as part
of the environment variable.

### For a non-lambda environment

```
    import { logger } from '@beforeyoubid/logger-adapter';

    logger.debug('This message only show up when LOG_LEVEL is set to "debug"')
    logger.info('This message only show up when LOG_LEVEL is set to "info"')
```

### Lambda: Use with an Aync Handler

```
  import { logger } from '@beforeyoubid/logger-adapter';

  const yourLambdaHandler = async (event, context) => {
    try {
      logger.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = await yourNormalProcess();

      // Ensure the we flush all messages before Lambda function gets terminated
      await logger.flushAll();

      return result;
    } catch (e) {
      // Ensure the we flush all messages before Lambda function gets terminated
      await logger.flushAll(); // Trigger to flush all messages

      // Throw or send result as usual
      throw e;

      // Or handle it nicely
      // return unsuccessfulResponse;
    }
  }

```

### Lambda: Use with a Callback Handler

```
  import { winstoneLogger as logger } from '@beforeyoubid/logger-adapter';

  const yourLambdaHandler = (event, context, callback) => {
    try {
      logger.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = yourNormalProcess();

      // Ensure the we flush all messages before Lambda function gets terminated
      await logger.flushAll(); // Trigger to flush all messages

      callback(null, yourNormalResponseObject);

    } catch (e) {
      // Ensure the we flush all messages before Lambda function gets terminated
      await logger.flushAll(); // Trigger to flush all messages

      // Call a callback with error
      callback(yourErrorObject);

      // Or return unsuccessful response
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
      // callback(null, unsuccessfulResponse);
    }
  }

```
