import { logger } from './logger';
import {
  Customer, CustomerClientInterface, GetCustomerInput, CreateCustomerInput,
} from './types/customer.type';
import { Output } from './types/output.type';

// TO DO: Use a more sophisticated 3rd party customer data platform vendor, such as Segment.io

class CustomerClient implements CustomerClientInterface {
  async createCustomer(createCustomerInput: CreateCustomerInput): Promise<Output<Customer>> {
    return {
      data: {
        customerID: 'customer-id-1',
        givenName: 'Raymond',
        familyName: 'Boles',
      },
    } as Output<Customer>;
  }

  async getCustomer(getCustomerInput: GetCustomerInput): Promise<Output<Customer>> {
    return {
      data: {
        customerID: 'customer-id-1',
        givenName: 'Raymond',
        familyName: 'Boles',
      },
    } as Output<Customer>;
  }

  async track(customerID: string, key: string, value: object): Promise<void> {
    logger.log('verbose', `Tracking customer ${customerID} for ${key} with value ${value}`);
  }
}

export { CustomerClient };
