import { testAuthorizationHeaderToken, testUserRequest } from '../../modules/common/test-data';
import { Output } from '../../modules/common/types/output.type';
import { RError } from '../../modules/error/types/error.type';
import { authorizationMiddleware, getAuthorizationBearerTokenFromRequest } from '../middlewares/auth.middleware';
import { HTTPRequest } from '../types/http.type';

const nextFn = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `getAuthorizationBearerTokenFromRequest` middleware', () => {
  describe('WHEN its invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<string> = {
        data: null,
      };

      const nullAuthorizationBearerTokenOutput = getAuthorizationBearerTokenFromRequest(null);
      const emptyAuthorizationBearerTokenOutput = getAuthorizationBearerTokenFromRequest(null);

      expect(nullAuthorizationBearerTokenOutput).toEqual(expectedOutput);
      expect(emptyAuthorizationBearerTokenOutput).toEqual(expectedOutput);
    });
  });

  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<string> = {
        data: null,
      };
      const requestInput = {
        headers: {
          authorization: 'invalid-token',
        },
      } as HTTPRequest;

      const nullAuthorizationBearerTokenOutput = getAuthorizationBearerTokenFromRequest(
        requestInput,
      );

      expect(nullAuthorizationBearerTokenOutput).toEqual(expectedOutput);
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const expectedOutput: Output<string> = {
        data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOiJhY2NvdW50LWlkLTEiLCJnaXZlbk5hbWUiOiJSYXltb25kIiwiZmFtaWx5TmFtZSI6IkJvbGVzIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjMxMTYyMzkwMjIsImlzcyI6Imh0dHBzOi8vaXNzdWVyLmNvbSIsInN1YiI6InN1YmplY3QtaWQiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdCIsImh0dHBzOi8vbG9jYWxob3N0Il19.RL15_MlOnwr4piaDI2TsadL038gwnxqkO__aiRPYSy4',
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredNoDomainAccess,
        },
      } as HTTPRequest;

      const validOutput = getAuthorizationBearerTokenFromRequest(requestInput);

      expect(validOutput).toEqual(expectedOutput);
    });
  });
});

describe('GIVEN `authorizationMiddleware` middleware', () => {
  describe('WHEN its invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<any> = {
        error: new RError('Invalid authorization header', 30002, 403),
      };
      const requestInput = {
        headers: {},
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });
  });

  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<any> = {
        error: new RError('Invalid token from middleware, Error: jwt malformed', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });

    test('THEN it should return expired output', async () => {
      const expectedOutput: Output<any> = {
        error: new RError('Invalid token from middleware, Error: jwt expired', 30002, 401),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.expiredNoDomainAccess,
        },
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return limited output', async () => {
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredNoDomainAccess,
        },
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
      expect(requestInput.auth).toEqual(testUserRequest.notExpiredNoDomainAccess);
    });

    test('THEN it should return limited output', async () => {
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpireDomainCreateReadAccess,
        },
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
      expect(requestInput.auth).toEqual(testUserRequest.notExpireDomainCreateReadAccess);
    });

    test('THEN it should return valid output', async () => {
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
      expect(requestInput.auth).toEqual(testUserRequest.notExpiredDomainAllAccess);
    });
  });
});
