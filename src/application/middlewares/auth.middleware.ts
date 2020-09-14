/* eslint-disable prefer-destructuring */
import {
  Request,
  Response,
  NextFunction,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import jsonWebToken from 'jsonwebtoken';
import {
  isEmpty,
} from 'lodash';

import { SECURITY } from '../../modules/common/constants';
import { LocalKeyVaultManagementService } from '../../modules/common/secrets';
import Adapter from '../../modules/common/types/adapter.type';
import { Output } from '../../modules/common/types/output.type';
import { applicationErrorCode } from '../../modules/error/error.codes';
import { RError } from '../../modules/error/types/error.type';
import { AuthRequestAdapter } from '../adapters/auth-request.adapter';
import { AuthRequest, AuthorizationToken } from '../types/auth.type';
import { HTTPRequest } from '../types/http.type';

const getAuthorizationBearerTokenFromRequest = (request: Request): Output<string> => {
  const output: Output<string> = {
    data: null,
  };

  try {
    const authTokenSubStrings = request?.headers?.authorization?.split(' ');
    if (authTokenSubStrings?.length === 2 && authTokenSubStrings[0]?.toLowerCase() === 'bearer') {
      output.data = authTokenSubStrings[1];
    }
  } catch (error) {
    output.error = new RError(`Invalid authorization bearer token, Error: ${error.message}`);
  }

  return output;
};

const authorizationMiddleware = async function authenticationMiddlewareHandler(
  request: HTTPRequest,
  _response: Response,
  nextFunc: NextFunction,
): Promise<void> {
  const authRequestAdapter: Adapter<AuthorizationToken, AuthRequest> = new AuthRequestAdapter();
  let middlewareError: RError;

  const authorizationBearerTokenOutput: Output<string> = getAuthorizationBearerTokenFromRequest(
    request,
  );
  if (authorizationBearerTokenOutput.error || !authorizationBearerTokenOutput.data) {
    middlewareError = new RError('Invalid authorization header', applicationErrorCode.unauthorized, StatusCodes.FORBIDDEN);
    return nextFunc(middlewareError);
  }
  const authorizationHeader: string = authorizationBearerTokenOutput.data;

  try {
    const secrets = new LocalKeyVaultManagementService();
    const authSecretOutput = await secrets.getValue(
      SECURITY.SECRETS_KEY.AUTHORIZATION_HEADER_SECRET,
    );
    if (!authSecretOutput.data || authSecretOutput.error) {
      middlewareError = new RError('Invalid secret', applicationErrorCode.default);
      return nextFunc(middlewareError);
    }

    const decodedToken: AuthorizationToken = jsonWebToken.verify(
      authorizationHeader,
      authSecretOutput.data,
    );

    if (!isEmpty(decodedToken)) {
      const adapterOutput: Output<AuthRequest> = authRequestAdapter.to(decodedToken);
      if (adapterOutput.error) { throw adapterOutput.error; }
      request.auth = adapterOutput.data;
    }
  } catch (error) {
    middlewareError = new RError(`Invalid token from middleware, Error: ${error.message}`, applicationErrorCode.unauthorized, StatusCodes.UNAUTHORIZED);
    return nextFunc(middlewareError);
  }

  return nextFunc();
};

export { getAuthorizationBearerTokenFromRequest, authorizationMiddleware };
