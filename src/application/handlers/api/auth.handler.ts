import {
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  isEmpty,
  intersection,
  difference,
} from 'lodash';

import { applicationErrorCode } from '../../../modules/error/error.codes';
import { RError } from '../../../modules/error/types/error.type';
import { AuthRequest, ScopePermissions } from '../../types/auth.type';
import { HTTPRequest } from '../../types/http.type';

const getAuthorizationHandler = (
  minimumScopesPermissions: ScopePermissions,
  isAllScopes = false,
): RequestHandler => {
  const authorizationHandler = async (
    request: HTTPRequest,
    _response: Response,
    nextFunc: NextFunction,
  ): Promise<void> => {
    const authorizationHeader: string = request.headers.authorization;
    const authRequest: AuthRequest = request.auth;

    let authorizationHandlerError: RError;
    if (!authorizationHeader || isEmpty(authRequest)) {
      authorizationHandlerError = new RError('Invalid authorization header request', applicationErrorCode.unauthorized, StatusCodes.FORBIDDEN);
      return nextFunc(authorizationHandlerError);
    }

    try {
      if (!isEmpty(minimumScopesPermissions)) {
        const scopePermissions: ScopePermissions = authRequest.scopes;

        let isAllowed = false;
        if (isAllScopes) {
          isAllowed = isEmpty(difference<string>(
            minimumScopesPermissions,
            scopePermissions,
          ));
        } else {
          isAllowed = !isEmpty(intersection<string>(minimumScopesPermissions, scopePermissions));
        }

        if (!isAllowed) {
          authorizationHandlerError = new RError('Unauthorized', applicationErrorCode.unauthorized, StatusCodes.UNAUTHORIZED);
          return nextFunc(authorizationHandlerError);
        }
      }
    } catch (error) {
      error = new RError(`Invalid token from handler, Error: ${error.message}`, applicationErrorCode.unauthorized, StatusCodes.UNAUTHORIZED);
      return nextFunc(error);
    }

    return nextFunc();
  };
  return authorizationHandler;
};

export { getAuthorizationHandler };
