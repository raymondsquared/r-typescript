import lodash from 'lodash';

import { testAuthorizationHeaderToken, testUserRequest } from '../../modules/common/test-data';
import { Output } from '../../modules/common/types/output.type';
import { RError } from '../../modules/error/types/error.type';
import { getAuthorizationHandler } from '../handlers/api/auth.handler';
import { ScopePermissions } from '../types/auth.type';
import { HTTPRequest } from '../types/http.type';

const nextFn = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `getAuthorizationHandler` middleware', () => {
  describe('WHEN its invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<any> = {
        error: new RError('Invalid authorization header request', 30002, 403),
      };
      const emptyAuthHeaderRequestInput = {
        headers: {},
        auth: testUserRequest.notExpiredNoDomainAccess,
      } as HTTPRequest;

      const emptyAuthHeaderRequestOutput = getAuthorizationHandler(null);
      await emptyAuthHeaderRequestOutput(emptyAuthHeaderRequestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });

    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<any> = {
        error: new RError('Invalid authorization header request', 30002, 403),
      };
      const emptyAuthRequestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
      } as HTTPRequest;

      const emptyAuthRequestOutput = getAuthorizationHandler(null);
      await emptyAuthRequestOutput(emptyAuthRequestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });
  });

  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return error output', async () => {
      const errorString = 'Expected getAuthorizationHandler error';
      const scopesInput: ScopePermissions = ['read:domain'];
      const expectedOutput: Output<any> = {
        error: new RError('Invalid token from handler, Error: Expected getAuthorizationHandler error', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
        auth: testUserRequest.notExpiredNoDomainAccess,
      } as HTTPRequest;

      jest.spyOn(lodash, 'intersection').mockImplementationOnce(() => { throw new Error(errorString); });

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });
  });

  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return limited output', async () => {
      const scopesInput: ScopePermissions = ['read:domain'];
      const expectedOutput: Output<any> = {
        error: new RError('Unauthorized', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredNoDomainAccess,
        },
        auth: testUserRequest.notExpiredNoDomainAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });

    test('THEN it should return limited output', async () => {
      const scopesInput: ScopePermissions = ['update:domain'];
      const expectedOutput: Output<any> = {
        error: new RError('Unauthorized', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpireDomainCreateReadAccess,
        },
        auth: testUserRequest.notExpireDomainCreateReadAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });

    test('THEN it should return limited output for random value', async () => {
      const scopesInput: ScopePermissions = ['read:random'];
      const expectedOutput: Output<any> = {
        error: new RError('Unauthorized', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpireDomainCreateReadAccess,
        },
        auth: testUserRequest.notExpireDomainCreateReadAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });

    test('THEN it should return invalid output with `isAllScopes`', async () => {
      const scopesInput: ScopePermissions = ['read:domain', 'update:domain'];
      const expectedOutput: Output<any> = {
        error: new RError('Unauthorized', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpireDomainCreateReadAccess,
        },
        auth: testUserRequest.notExpireDomainCreateReadAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput, true);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return limited output', async () => {
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredNoDomainAccess,
        },
        auth: testUserRequest.notExpiredNoDomainAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(null);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
    });

    test('THEN it should return limited output', async () => {
      const scopesInput: ScopePermissions = ['read:domain', 'update:domain'];
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpireDomainCreateReadAccess,
        },
        auth: testUserRequest.notExpireDomainCreateReadAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
    });

    test('THEN it should return valid output', async () => {
      const scopesInput: ScopePermissions = ['delete:domain'];
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
        auth: testUserRequest.notExpiredDomainAllAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
    });

    test('THEN it should return valid output with `isAllScopes`', async () => {
      const scopesInput: ScopePermissions = ['create:domain', 'read:domain', 'update:domain'];
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
        auth: testUserRequest.notExpiredDomainAllAccess,
      } as HTTPRequest;

      const authorizationMiddlewareOutput = getAuthorizationHandler(scopesInput, true);
      await authorizationMiddlewareOutput(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
    });
  });
});
