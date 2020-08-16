# LogDNA Logger Adapter

This is a platform logger module that is able to support multiple logging scenarios.

- A `console` log wrapper so it can send all logs from the native `console` object to LogDNA.
- A Winston log wrapper logger which output better colour and we can send log messages to LogNDA.

This module is designed to work on a native node runtime and in a Lambda environment. For Lambda, please see the
[Flush All Messages](#Flush-All-Messages) section below.

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

Additionally, you can keep `LOGDNA_KEY` value the same way you set for other environments but can disable sending logs
by setting `LOGDNA_ENABLED=false` in your env variables.

### For a non-lambda environment

```
    import { consoleLogger } from '@beforeyoubid/logger-adapter';
    consoleLogger.init();

    // Don't need to call consoleLogger.flushAll(), logdna object has default flush interval interval at 250ms
```

### Lambda: Use with an Aync Handler

```
  import { consoleLogger, flushAll } from '@beforeyoubid/logger-adapter';
  consoleLogger.init();

  // Ensure the we flush all messages before Lambda function gets terminated
  const yourLambdaHandler = async (event, context) => {
    try {
      console.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = await yourNormalProcess();

      await flushAll(); // Trigger to flush all messages

      return result;
    } catch (e) {
      // handle error
      await flushAll(); // Trigger to flush all messages

      // Throw or send result as usual
      throw e;

      // Or handle it nicely
      // return unsuccessfulResponse;
    }
  }

```

### Lambda: Use with a Callback Handler

```
  import { consoleLogger, flushAll } from '@beforeyoubid/logger-adapter';
  consoleLogger.init();

  const yourLambdaHandler = (event, context, callback) => {
    try {
      console.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = yourNormalProcess();

      callback(null, yourNormalResponseObject);

      flushAll(); // Trigger to flush all messages
    } catch (e) {

      // Ensure the we flush all messages before Lambda function gets terminated
      flushAll(); // Trigger to flush all messages

      // Call a callback with error
      callback(yourErrorObject);

      // Or return unsuccessful response
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
      // callback(null, unsuccessfulResponse);
    }
  }

```

### Lambda: Use a handler wrapper for Serverless Express

```
  import { consoleLogger, ensureFlushAll } from '@beforeyoubid/logger-adapter';
  consoleLogger.init();

  export default ensureFlushAll(graphqlHandler);

```

### Lambda: Use with a Callback Handler (Apollo GraphQL Handler)

```
  import { consoleLogger, ensureFlushAllCallback } from '@beforeyoubid/logger-adapter';
  consoleLogger.init();

  // Existing graphql hander - it uses callback signature
  const graphqlHandler = server.createHandler({
    cors: {
      origin: '*',
      allowedHeaders: ['x-api-token', 'Authorization'],
      methods: ['GET', 'POST'],
    },
  });

  export default ensureFlushAllCallback(graphqlHandler);

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
  import { logger, flushAll } from '@beforeyoubid/logger-adapter';

  const yourLambdaHandler = async (event, context) => {
    try {
      logger.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = await yourNormalProcess();

      // Ensure the we flush all messages before Lambda function gets terminated
      await flushAll();

      return result;
    } catch (e) {
      // Ensure the we flush all messages before Lambda function gets terminated
      await flushAll(); // Trigger to flush all messages

      // Throw or send result as usual
      throw e;

      // Or handle it nicely
      // return unsuccessfulResponse;
    }
  }

```

### Lambda: Use with a Callback Handler

```
  import { logger, flushAll } from '@beforeyoubid/logger-adapter';

  const yourLambdaHandler = (event, context, callback) => {
    try {
      logger.debug('Sample debug log - this message only show up when LOG_LEVEL is set to "debug"')

      const result = yourNormalProcess();

      callback(null, yourNormalResponseObject);

      // Ensure the we flush all messages before Lambda function gets terminated
      flushAll(); // Trigger to flush all messages
    } catch (e) {
      // Ensure the we flush all messages before Lambda function gets terminated
      flushAll(); // Trigger to flush all messages

      // Call a callback with error
      callback(yourErrorObject);

      // Or return unsuccessful response
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
      // callback(null, unsuccessfulResponse);
    }
  }

```

## Flush All Messages

LogDNA puts messages in the buffer and push out every 250ms. If Lambda is terminated before some of these intervals,
it's likely that some of message logs are not sent to LogDNA.

We just need to ensure that after we've completed the business logic and before the Lambda function is terminated, we
flush all messages. We can just call a LogDNA `flushAll()` function and this module export this logic for us to use.
Depending on how your Lambda handler is set up, but there are three variances we have observed.

1. Async handler
2. Async handler but use Serverless Express framework
3. Apollo non-async handler which is created by a `createHandler()` function

Please see usage examples from the above sections
