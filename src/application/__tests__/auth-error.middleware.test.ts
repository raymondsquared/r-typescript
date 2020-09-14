import { testAuthorizationHeaderToken } from '../../modules/common/test-data';
import { RError } from '../../modules/error/types/error.type';
import { authorizationMiddleware } from '../middlewares/auth.middleware';
import { HTTPRequest } from '../types/http.type';

const nextFn = jest.fn();

// REF: https://github.com/facebook/jest/issues/2582
jest.mock('../../modules/common/secrets', () => ({
  LocalKeyVaultManagementService: jest.fn().mockImplementation(() => ({
    getValue: async () => Promise.resolve({
      data: null,
      error: new RError('get-value-error'),
    }),
  })),
}));

describe('GIVEN `authorizationMiddleware` middleware', () => {
  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedError = new RError('Invalid secret', 500, 500);
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
      } as HTTPRequest;

      await authorizationMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedError);
    });
  });
});
