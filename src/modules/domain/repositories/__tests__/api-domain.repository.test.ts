import axios from 'axios';
import moment from 'moment';

import { Domain } from '../../types/domain.type';
import { Output } from '../../../common/types/output.type';
import { DomainRepository } from '../../types/repository.type';
import { RError } from '../../../error/types/error.type';
import { APIDomainRepository } from '../api-domain.repository';
import { DomainEntity } from '../../types/entity.type';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

let domainRepository: DomainRepository;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  domainRepository = new APIDomainRepository('http://valid-url.com', 'api-key', 'api-secret');
});

describe('GIVEN `readOneDomain` method in `APIDomainRepository` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError('Invalid ID'),
      };

      const undefinedOutput = await domainRepository.readOneDomain(undefined);
      const nullOutput = await domainRepository.readOneDomain(null);
      const emptyOutput = await domainRepository.readOneDomain('');

      expect(undefinedOutput).toEqual(expectedOutput);
      expect(undefinedOutput.error).toBeInstanceOf(RError);
      expect((undefinedOutput.error as RError).code).toBe(70001);
      expect((undefinedOutput.error as RError).httpStatusCode).toBe(500);

      expect(nullOutput).toEqual(expectedOutput);
      expect(nullOutput.error).toBeInstanceOf(RError);
      expect((nullOutput.error as RError).code).toBe(70001);
      expect((nullOutput.error as RError).httpStatusCode).toBe(500);

      expect(emptyOutput).toEqual(expectedOutput);
      expect(emptyOutput.error).toBeInstanceOf(RError);
      expect((emptyOutput.error as RError).code).toBe(70001);
      expect((emptyOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with error', () => {
    test('THEN it should return invalid output', async () => {
      const errorInput: Output<DomainEntity> = {
        data: {
          domainID: 'domain-repository-error-id',
          dateTime: 'invalid-date',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-1',
          passportNumber: 'A1234567',
        },
      };
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError('Failed reading one Domain, Error: Failed adapting from Domain Entity to Domain, Error: Invalid data'),
      };

      mockAxios.get.mockResolvedValueOnce(errorInput);
      const errorOutput = await domainRepository.readOneDomain('domain-repository-error-id');

      expect(errorOutput).toEqual(expectedOutput);
      expect(errorOutput.error).toBeInstanceOf(RError);
      expect((errorOutput.error as RError).code).toBe(70000);
      expect((errorOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with HTTP error', () => {
    test('THEN it should return invalid output', async () => {
      const httpClientErrorMesage = 'test-invalid-http-client-error';
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError(httpClientErrorMesage),
      };

      mockAxios.get.mockRejectedValueOnce(new Error(httpClientErrorMesage));

      const invalidOutput = await domainRepository.readOneDomain('invalid-id');

      expect(invalidOutput).toEqual(expectedOutput);
      expect(invalidOutput.error).toBeInstanceOf(RError);
      expect((invalidOutput.error as RError).code).toBe(40002);
      expect((invalidOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const validInput: Output<DomainEntity> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: '2020-12-24T13:14:15.000Z',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-1',
          passportNumber: 'A1234567',
        },
      };
      const expectedOutput: Output<Domain> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: moment('2020-12-24T13:14:15.000Z'),
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-1',
          passportNumber: 'A1234567',
        },
      };

      mockAxios.get.mockResolvedValueOnce(validInput);

      const validOutput = await domainRepository.readOneDomain('valid-id');

      expect(validOutput).toEqual(expectedOutput);
    });
  });
});
