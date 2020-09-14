import { CustomerClient } from '../customer-client';
import { CreateCustomerInput, Customer, GetCustomerInput } from '../types/customer.type';
import { Output } from '../types/output.type';

const customerClient = new CustomerClient();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `SecurityClient` module', () => {
  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const customerInput: Customer = {
        customerID: 'customer-id-1',
        givenName: 'Raymond',
        familyName: 'Boles',
      };
      let errorOutput: Error;

      try {
        const createCustomerOutput: Output<Customer> = await customerClient.createCustomer(
          { ...customerInput } as CreateCustomerInput,
        );
        const getCustomerOutput: Output<Customer> = await customerClient.getCustomer(
          { ...createCustomerOutput?.data } as GetCustomerInput,
        );
        await customerClient.track(getCustomerOutput?.data?.customerID, 'key', { foo: 'bar' });
      } catch (error) {
        errorOutput = error;
      }

      expect(errorOutput).toBeUndefined();
    });
  });
});
