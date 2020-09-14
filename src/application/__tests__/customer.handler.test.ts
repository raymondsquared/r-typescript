import { testUserRequest } from '../../modules/common/test-data';
import { getCustomerHandler } from '../handlers/api/customer.handler';
import { HTTPRequest } from '../types/http.type';

const nextFn = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `getCustomerHandler` middleware', () => {
  describe('WHEN its invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const emptyAuthHeaderRequestInput = {} as HTTPRequest;

      const emptyCustomerOutput = getCustomerHandler(null);
      await emptyCustomerOutput(emptyAuthHeaderRequestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const validAuthHeaderRequestInput = {
        auth: testUserRequest.notExpiredDomainAllAccess,
      } as HTTPRequest;

      const validCustomerOutput = getCustomerHandler(null);
      await validCustomerOutput(validAuthHeaderRequestInput, null, nextFn);

      expect(nextFn).toBeCalledWith();
    });
  });
});
