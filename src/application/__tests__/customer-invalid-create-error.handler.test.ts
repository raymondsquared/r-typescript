import { testUserRequest } from '../../modules/common/test-data';
import { RError } from '../../modules/error/types/error.type';
import { getCustomerHandler } from '../handlers/api/customer.handler';
import { HTTPRequest } from '../types/http.type';

const nextFn = jest.fn();

// REF: https://github.com/facebook/jest/issues/2582
jest.mock('../../modules/common/customer-client', () => ({
  CustomerClient: jest.fn().mockImplementation(() => ({
    getCustomer: async () => Promise.resolve({
      data: null,
      error: new RError('get-customer-error'),
    }),
    createCustomer: async () => Promise.resolve({
      data: null,
      error: new RError('create-customer-error'),
    }),
  })),
}));

describe('GIVEN `getCustomerHandler` middleware', () => {
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
