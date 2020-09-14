import { StatusCodes } from 'http-status-codes';

import { DEFAULT } from '../../common/constants';

// RError represents error thrown by typescript microservices
// REF: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
class RError extends Error {
  code: number;

  httpStatusCode: number;

  errorString: string;

  constructor(
    errorString = DEFAULT.ERROR_MESSAGE,
    code = StatusCodes.INTERNAL_SERVER_ERROR,
    httpStatusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(errorString);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RError.prototype);

    this.code = code;
    this.httpStatusCode = httpStatusCode;
    this.errorString = errorString;
  }
}

export { RError };
