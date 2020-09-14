import moment from 'moment';

import { LocalDomainRepository } from '../local-domain.repository';
import { Domain } from '../../types/domain.type';
import { Output } from '../../../common/types/output.type';
import { DomainRepository } from '../../types/repository.type';
import { RError } from '../../../error/types/error.type';

let domainRepository: DomainRepository;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  domainRepository = new LocalDomainRepository();
});

describe('GIVEN `readOneDomain` method in `LocalDomainRepository` module', () => {
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

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return valid output', async () => {
      const expectedOutput: Output<Domain> = {
        data: null,
      };

      const invalidOutput = await domainRepository.readOneDomain('invalid-id');

      expect(invalidOutput).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with error input', () => {
    test('THEN it should return error output', async () => {
      const expectedRepositoryErrorOutput: Output<Domain> = {
        data: null,
        error: new RError('Failed reading one Domain, Error: Failed adapting from Domain Entity to Domain, Error: Invalid data'),
      };
      const expectedHTTPClientErrorOutput: Output<Domain> = {
        data: null,
        error: new RError('Expected HTTP client error'),
      };

      const repositoryErrorOutput = await domainRepository.readOneDomain('domain-repository-error-id');
      const httpClientErrorOutput = await domainRepository.readOneDomain('http-client-error-id');

      expect(repositoryErrorOutput).toEqual(expectedRepositoryErrorOutput);
      expect(repositoryErrorOutput.error).toBeInstanceOf(RError);
      expect((repositoryErrorOutput.error as RError).code).toBe(70000);
      expect((repositoryErrorOutput.error as RError).httpStatusCode).toBe(500);

      expect(httpClientErrorOutput).toEqual(expectedHTTPClientErrorOutput);
      expect(httpClientErrorOutput.error).toBeInstanceOf(RError);
      expect((httpClientErrorOutput.error as RError).code).toBe(40002);
      expect((httpClientErrorOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const validInput = 'domain-id-1';
      const expectedOutput: Output<Domain> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: moment('2020-12-24T13:14:15.000Z'),
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-3',
          passportNumber: 'A1234567',
        },
      };

      const validOutput = await domainRepository.readOneDomain(validInput);

      expect(validOutput).toEqual(expectedOutput);
    });
  });
});
