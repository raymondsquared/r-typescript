import { testAuthorizationHeaderToken } from '../../modules/common/test-data';
import { Output } from '../../modules/common/types/output.type';
import { RError } from '../../modules/error/types/error.type';
import { ipAddressThrottlingMiddleware } from '../middlewares/throttling/ip-address-throttling.middleware';
import { HTTPRequest } from '../types/http.type';

const nextFn = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `ipAddressThrottlingMiddleware` middleware', () => {
  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const expectedOutput: Output<any> = {
        error: new RError('Too many request', 30003, 429),
      };
      const requestInput = {
        headers: {
          authorization: testAuthorizationHeaderToken.notExpiredDomainAllAccess,
        },
        ip: 'ip.1',
      } as HTTPRequest;

      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, jest.fn());
      await ipAddressThrottlingMiddleware(requestInput, null, nextFn);

      expect(nextFn).toBeCalledWith(expectedOutput.error);
    });
  });
});
