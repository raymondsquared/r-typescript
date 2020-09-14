import { Output } from './output.type';

interface Customer {
  customerID: string;
  givenName: string;
  familyName: string;
}

interface CreateCustomerInput {
  givenName?: string;
  familyName?: string;
}

interface GetCustomerInput {
  givenName?: string;
  familyName?: string;
}

interface CustomerClientInterface {
  createCustomer(input: CreateCustomerInput): Promise<Output<Customer>>;
  getCustomer(input: GetCustomerInput): Promise<Output<Customer>>;
  track(customerID: string, key: string, data: object): Promise<void>;
}

export {
  Customer,
  CreateCustomerInput,
  GetCustomerInput,
  CustomerClientInterface,
};
