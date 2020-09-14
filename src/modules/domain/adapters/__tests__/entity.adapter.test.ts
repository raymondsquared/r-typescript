import moment from 'moment';
import Adapter from '../../../common/types/adapter.type';
import { Output } from '../../../common/types/output.type';
import { RError } from '../../../error/types/error.type';
import { Domain } from '../../types/domain.type';
import { DomainEntity } from '../../types/entity.type';
import { DomainEntityAdapter } from '../entity.adapter';

let domainEntityAdapter: Adapter<Domain, DomainEntity>;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  domainEntityAdapter = new DomainEntityAdapter();
});

describe('GIVEN `from` method in `DomainEntityAdapter` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', () => {
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError('Failed adapting from Domain Entity to Domain, Error: Invalid input'),
      };

      const undefinedOutput = domainEntityAdapter.from(undefined);
      const nullOutput = domainEntityAdapter.from(null);

      expect(undefinedOutput).toEqual(expectedOutput);
      expect(undefinedOutput.error).toBeInstanceOf(RError);
      expect((undefinedOutput.error as RError).code).toBe(40000);
      expect((undefinedOutput.error as RError).httpStatusCode).toBe(500);

      expect(nullOutput).toEqual(expectedOutput);
      expect(nullOutput.error).toBeInstanceOf(RError);
      expect((nullOutput.error as RError).code).toBe(40000);
      expect((nullOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', () => {
      const invalidInput: DomainEntity = {
        domainID: 'domain-id-1',
        dateTime: 'invalid-date',
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-3',
        passportNumber: 'A1234567',
      };
      const expectedOutput: Output<Domain> = {
        data: null,
        error: new RError('Failed adapting from Domain Entity to Domain, Error: Invalid data'),
      };

      const invalidOutput = domainEntityAdapter.from(invalidInput);

      expect(invalidOutput).toEqual(expectedOutput);
      expect(invalidOutput.error).toBeInstanceOf(RError);
      expect((invalidOutput.error as RError).code).toBe(40000);
      expect((invalidOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', () => {
      const validInput: DomainEntity = {
        domainID: 'domain-id-1',
        dateTime: '2020-12-24T13:14:15.000Z',
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-3',
        passportNumber: 'A1234567',
      };
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

      const validOutput = domainEntityAdapter.from(validInput);

      expect(validOutput).toEqual(expectedOutput);
      expect(validOutput.error).toBeUndefined();
    });
  });
});

describe('GIVEN `to` method in `DomainEntityAdapter` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', () => {
      expect(() => { domainEntityAdapter.to(null); }).toThrowError();
    });
  });
});
