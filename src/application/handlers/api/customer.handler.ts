import {
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import {
  isEmpty,
} from 'lodash';
import { v4 as uuidV4 } from 'uuid';

import { OBSERVABILITY } from '../../../modules/common/constants';
import { CustomerClient } from '../../../modules/common/customer-client';
import { logger } from '../../../modules/common/logger';
import { Customer, CreateCustomerInput, GetCustomerInput } from '../../../modules/common/types/customer.type';
import { Output } from '../../../modules/common/types/output.type';
import { applicationErrorCode } from '../../../modules/error/error.codes';
import { AuthRequest } from '../../types/auth.type';
import { HTTPRequest } from '../../types/http.type';

const customerClient = new CustomerClient();

const getCustomerHandler = (
  key: string,
  data?: object,
): RequestHandler => {
  const customerHandler = async (
    request: HTTPRequest,
    _response: Response,
    nextFunc: NextFunction,
  ): Promise<void> => {
    const authRequest: AuthRequest = request.auth;

    try {
      if (!isEmpty(authRequest)) {
        let customer: Customer;
        const getCustomerOutput: Output<Customer> = await customerClient.getCustomer(
          {
            givenName: authRequest.givenName,
            familyName: authRequest.familyName,
          } as GetCustomerInput,
        );

        if (getCustomerOutput.error) {
          logger.log('warn', `Failed getting customer, Error: ${getCustomerOutput.error.message}`);
        }

        if (!isEmpty(getCustomerOutput.data)) {
          customer = getCustomerOutput.data;
        } else {
          const createCustomerOutput: Output<Customer> = await customerClient.createCustomer(
            {
              givenName: authRequest.givenName,
              familyName: authRequest.familyName,
            } as CreateCustomerInput,
          );

          if (createCustomerOutput.error) throw createCustomerOutput.error;
          customer = createCustomerOutput.data;
        }

        await customerClient.track(customer?.customerID, key, data);
      }
    } catch (error) {
      // We do not want to break the whole app if the Customer Data Platform Analysis
      // operations aren't working
      // Logging them should be sufficient
      logger.error(
        `Failed handling customer for ${authRequest.accountID}`,
        {
          id: uuidV4(),
          dateTime: new Date().toISOString(),
          serviceID: OBSERVABILITY.SERVICE_ID,
          serviceType: OBSERVABILITY.SERVICE_TYPE.API,
          errorCode: applicationErrorCode.default,
        },
      );
    }

    return nextFunc();
  };

  return customerHandler;
};

export { getCustomerHandler };
