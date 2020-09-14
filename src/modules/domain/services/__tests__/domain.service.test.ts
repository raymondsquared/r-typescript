import moment from 'moment';

import { MainDomainService } from '../domain.service';
import { Domain } from '../../types/domain.type';
import { DomainRepository } from '../../types/repository.type';
import { DomainService } from '../../types/service.type';
import { Output } from '../../../common/types/output.type';
import { LocalDomainRepository } from '../../repositories/local-domain.repository';
import { RError } from '../../../error/types/error.type';
import { domainErrorCode } from '../../../error/error.codes';

let domainRepository: DomainRepository;
let domainService: DomainService;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  domainRepository = new LocalDomainRepository();
  domainService = new MainDomainService(domainRepository);
});

describe('GIVEN `getDomain` method in `MainDomainService` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<DomainService> = {
        data: null,
        error: new RError('Invalid ID'),
      };

      const undefinedOutput = await domainService.getOneDomain(undefined);
      const nullOutput = await domainService.getOneDomain(null);
      const emptyOutput = await domainService.getOneDomain('');

      expect(undefinedOutput).toEqual(expectedOutput);
      expect(undefinedOutput.error).toBeInstanceOf(RError);
      expect((undefinedOutput.error as RError).code).toBe(60001);
      expect((undefinedOutput.error as RError).httpStatusCode).toBe(500);

      expect(nullOutput).toEqual(expectedOutput);
      expect(nullOutput.error).toBeInstanceOf(RError);
      expect((nullOutput.error as RError).code).toBe(60001);
      expect((nullOutput.error as RError).httpStatusCode).toBe(500);

      expect(emptyOutput).toEqual(expectedOutput);
      expect(emptyOutput.error).toBeInstanceOf(RError);
      expect((emptyOutput.error as RError).code).toBe(60001);
      expect((emptyOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const invalidInput = 'random-id';
      const expectedOutput: Output<Domain> = {
        data: null,
      };

      const invalidOutput = await domainService.getOneDomain(invalidInput);

      expect(invalidOutput).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with error', () => {
    test('THEN it should return invalid output', async () => {
      const errorString = 'domain-repository-error-id';
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError(`Failed getting one Domain, Error: ${errorString}`, domainErrorCode.default),
      };

      jest.spyOn(domainRepository, 'readOneDomain').mockImplementation(() => { throw new Error(errorString); });

      const invalidOutput = await domainService.getOneDomain(errorString);

      expect(invalidOutput).toEqual(expectedOutput);
      expect(invalidOutput.error).toBeInstanceOf(RError);
      expect((invalidOutput.error as RError).code).toBe(50000);
      expect((invalidOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with invalid input - empty ownerAccountID', () => {
    test('THEN it should return invalid output', async () => {
      const invalidInput = 'invalidated-id';
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError(`Invalid Domain, ID: ${invalidInput}`, domainErrorCode.default),
      };

      jest.spyOn(domainRepository, 'readOneDomain').mockImplementation(
        async (): Promise<Output<Domain>> => ({
          data: {
            domainID: invalidInput,
            dateTime: moment(),
            isValidated: true,
            numeric: 1,
            ownerAccountID: '',
            passportNumber: '',
          },
        }),
      );

      const invalidOutput = await domainService.getOneDomain(invalidInput);

      expect(invalidOutput).toEqual(expectedOutput);
      expect(invalidOutput.error).toBeInstanceOf(RError);
      expect((invalidOutput.error as RError).code).toBe(50000);
      expect((invalidOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return invalid output', async () => {
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

      const validOutput = await domainService.getOneDomain(validInput);

      expect(validOutput).toEqual(expectedOutput);
    });
  });
});
