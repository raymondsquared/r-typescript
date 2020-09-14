import axios from 'axios';
import { DomainEntity } from '../../domain/types/entity.type';

import { RError } from '../../error/types/error.type';
import { createCircuitBreaker } from '../circuit-breaker';
import { HTTPClient } from '../http-client';
import { CircuitBreaker } from '../types/circuit-breaker.type';
import { HTTPAuthorization, HTTPClientInterface } from '../types/http.type';
import { Output } from '../types/output.type';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

let httpClient: HTTPClientInterface;
let circuitBreaker: CircuitBreaker;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  httpClient = new HTTPClient();
  circuitBreaker = createCircuitBreaker(
    async () => httpClient.get<DomainEntity>(
      'http://api-url.com',
      {
        scheme: 'Bearer',
        parameter: '1234-abcd',
      } as HTTPAuthorization,
    ),
  );
});

describe('GIVEN `circuit-breaker` module', () => {
  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const httpClientErrorMesage = 'test-invalid-http-client-error';
      const circuitBreakererrorMesage = 'test-invalid-circuit-breaker-error';
      const expectedOutput: Output<DomainEntity> = {
        data: null,
        error: new RError(`${circuitBreakererrorMesage} ${httpClientErrorMesage}`),
      };

      mockAxios.get.mockRejectedValueOnce(new Error(httpClientErrorMesage));

      const invalidOutput: Output<DomainEntity> = {
        data: null,
      };
      await circuitBreaker?.fire()
        .then((getDomainEntityFromAPIOutput: Output<DomainEntity>) => {
          if (getDomainEntityFromAPIOutput?.error) {
            throw getDomainEntityFromAPIOutput?.error;
          }
          invalidOutput.data = getDomainEntityFromAPIOutput.data;
        })
        .catch((error) => {
          invalidOutput.error = new RError(`${circuitBreakererrorMesage} ${error.message}`, 12345);
        });

      expect(invalidOutput).toEqual(expectedOutput);
      expect(invalidOutput.error).toBeInstanceOf(RError);
      expect((invalidOutput.error as RError).code).toBe(12345);
      expect((invalidOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const expectedOutput: Output<DomainEntity> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: '2020-12-24T13:14:15.000Z',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-1',
          passportNumber: 'A1234567',
        } as DomainEntity,
      };

      mockAxios.get.mockResolvedValueOnce(expectedOutput);

      const validOutput: Output<DomainEntity> = {
        data: null,
      };
      await circuitBreaker?.fire()
        .then((getDomainEntityFromAPIOutput: Output<DomainEntity>) => {
          if (getDomainEntityFromAPIOutput?.error) {
            throw getDomainEntityFromAPIOutput?.error;
          }
          validOutput.data = getDomainEntityFromAPIOutput.data;
        })
        .catch((error) => {
          validOutput.error = new RError(`test-invalid-circuit-breaker-error ${error.message}`);
        });

      expect(validOutput).toEqual(expectedOutput);
    });
  });
});
