import {
  Response,
  NextFunction,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { v4 as uuidV4 } from 'uuid';
import { OBSERVABILITY } from '../../../modules/common/constants';

import { logger } from '../../../modules/common/logger';
import { ObservabilityClient } from '../../../modules/common/observability-client';
import { applicationErrorCode } from '../../../modules/error/error.codes';
import { RError } from '../../../modules/error/types/error.type';
import { HTTPRequest } from '../../types/http.type';

const ipAddressThrottling = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 1, // per 1 second by IP
});

const observabilityClient = new ObservabilityClient();

const ipAddressThrottlingMiddleware = async function authenticationMiddlewareHandler(
  request: HTTPRequest,
  _response: Response,
  nextFunc: NextFunction,
): Promise<void> {
  return ipAddressThrottling.consume(request.ip)
    .then(() => nextFunc())
    .catch(() => {
      logger.warn(
        `Too many request for IP address: ${request.ip}`,
        {
          id: uuidV4(),
          dateTime: new Date().toISOString(),
          serviceID: OBSERVABILITY.SERVICE_ID,
          serviceType: OBSERVABILITY.SERVICE_TYPE.API,
          errorCode: applicationErrorCode.default,
        },
      );
      observabilityClient.increase(
        `${OBSERVABILITY.SERVICE_ID}/${OBSERVABILITY.SERVICE_TYPE}/${OBSERVABILITY.METRIC.COUNT_IP_ADDRESSES_THROTTLED}`, 
        1,
      );

      const error = new RError('Too many request', applicationErrorCode.throttled, StatusCodes.TOO_MANY_REQUESTS);
      return nextFunc(error);
    });
};

export { ipAddressThrottlingMiddleware };
