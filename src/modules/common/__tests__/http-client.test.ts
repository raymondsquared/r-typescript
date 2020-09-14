import axios from 'axios';
import { DomainEntity } from '../../domain/types/entity.type';

import { RError } from '../../error/types/error.type';
import { HTTPClient } from '../http-client';
import { HTTPAuthorization, HTTPClientInterface } from '../types/http.type';
import { Output } from '../types/output.type';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

let httpClient: HTTPClientInterface;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  httpClient = new HTTPClient();
});

describe('GIVEN `get` method in `httpClient` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<DomainEntity> = {
        data: null,
        error: new RError('Invalid URL'),
      };

      const undefinedOutput = await httpClient.get(undefined, undefined);
      const nullOutput = await httpClient.get(null, null);
      const emptyOutput = await httpClient.get('', null);

      expect(undefinedOutput).toEqual(expectedOutput);
      expect(undefinedOutput.error).toBeInstanceOf(RError);
      expect((undefinedOutput.error as RError).code).toBe(40002);
      expect((undefinedOutput.error as RError).httpStatusCode).toBe(500);

      expect(nullOutput).toEqual(expectedOutput);
      expect(nullOutput.error).toBeInstanceOf(RError);
      expect((nullOutput.error as RError).code).toBe(40002);
      expect((nullOutput.error as RError).httpStatusCode).toBe(500);

      expect(emptyOutput).toEqual(expectedOutput);
      expect(emptyOutput.error).toBeInstanceOf(RError);
      expect((emptyOutput.error as RError).code).toBe(40002);
      expect((emptyOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const errorString = 'test-error-string';
      const expectedOutput: Output<DomainEntity> = {
        data: null,
        error: new RError(`${errorString}`),
      };

      mockAxios.get.mockRejectedValueOnce(new Error(errorString));

      const invalidOutput = await httpClient.get('https://invalid-url.com', null);

      expect(invalidOutput).toEqual(expectedOutput);
      expect(invalidOutput.error).toBeInstanceOf(RError);
      expect((invalidOutput.error as RError).code).toBe(40002);
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

      const validOutput = await httpClient.get(
        'https://valid-url.com',
        {
          scheme: 'Bearer',
          parameter: '1234-abcd',
        } as HTTPAuthorization,
      );

      expect(validOutput).toEqual(expectedOutput);
    });
  });
});
