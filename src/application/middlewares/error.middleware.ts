/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { v4 as uuidV4 } from 'uuid';
import { OBSERVABILITY } from '../../modules/common/constants';

import { logger } from '../../modules/common/logger';
import { Output } from '../../modules/common/types/output.type';
import { applicationErrorCode } from '../../modules/error/error.codes';
import { RError } from '../../modules/error/types/error.type';

// errorAdapterMiddleware will catch error thrown by the handlers
// Wrap error / RError into ROutput
const errorAdapterMiddleware = async function errorAdaptingMiddlewareHandler(
  error: Error,
  _request: Request,
  response: Response,
  _nextFunc: NextFunction,
): Promise<void> {
  let rError: RError;
  if (error instanceof RError) {
    rError = error;
  } else if ((error as any)?.status as number) {
    rError = new RError(error?.message, (error as any).status);
  } else {
    rError = new RError(error?.message, applicationErrorCode.default);
  }

  const output: Output<any> = {
    error: {
      code: rError.code,
      httpStatusCode: rError.httpStatusCode,
      errorString: rError.errorString,
    } as RError,
  };
  response.status(rError.httpStatusCode);
  response.send(output);
};

const errorLoggingMiddleware = async function errorLoggingMiddlewareHandler(
  error: Error,
  _request: Request,
  _response: Response,
  nextFunc: NextFunction,
): Promise<void> {
  logger.error(
    `Error caught from middleware:${error.message} `,
    {
      id: uuidV4(),
      dateTime: new Date().toISOString(),
      serviceID: OBSERVABILITY.SERVICE_ID,
      serviceType: OBSERVABILITY.SERVICE_TYPE.API,
      errorCode: applicationErrorCode.default,
    },
  );

  nextFunc(error);
};

export { errorAdapterMiddleware, errorLoggingMiddleware };
