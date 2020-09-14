import lodash from 'lodash';
import moment from 'moment';

import { DomainValidator } from '../domain.validator';
import { Domain } from '../../types/domain.type';
import { Output } from '../../../common/types/output.type';
import { Validator } from '../../../common/validator.type';
import { RError } from '../../../error/types/error.type';
import { domainErrorCode } from '../../../error/error.codes';

const domainValidator: Validator<Domain> = new DomainValidator();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `isValid` method in `DomainValidator` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput: Output<boolean> = {
        data: false,
      };
      expect(domainValidator.isValid(undefined)).toEqual(expectedOutput);
      expect(domainValidator.isValid(null)).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const invalidEmptyIdInput: Domain = {
        domainID: '',
        dateTime: moment(),
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-1',
        passportNumber: 'A1234567',
      };
      const invalidEmptyOwnerAccountIdInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment(),
        isValidated: true,
        numeric: 1,
        ownerAccountID: '',
        passportNumber: 'A1234567',
      };
      const expectedOutput: Output<boolean> = {
        data: false,
      };
      expect(domainValidator.isValid({} as Domain)).toEqual(expectedOutput);
      expect(domainValidator.isValid(invalidEmptyIdInput)).toEqual(expectedOutput);
      expect(domainValidator.isValid(invalidEmptyOwnerAccountIdInput)).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with invalid numeric input', () => {
    test('THEN it should return invalid output', async () => {
      const invalidNegativeNumericInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment(),
        isValidated: true,
        numeric: -1,
        ownerAccountID: 'account-id-1',
        passportNumber: 'A1234567',
      };
      const invalidZeroNumericInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment(),
        isValidated: true,
        numeric: 0,
        ownerAccountID: 'account-id-1',
        passportNumber: 'A1234567',
      };
      const invalidInfiniterNumericInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment(),
        isValidated: true,
        numeric: Infinity,
        ownerAccountID: 'account-id-1',
        passportNumber: 'A1234567',
      };
      const expectedOutput: Output<boolean> = {
        data: false,
      };
      expect(domainValidator.isValid(invalidNegativeNumericInput)).toEqual(expectedOutput);
      expect(domainValidator.isValid(invalidZeroNumericInput)).toEqual(expectedOutput);
      expect(domainValidator.isValid(invalidInfiniterNumericInput)).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with error', () => {
    test('THEN it should return invalid output', async () => {
      const errorString = 'test-validation-error';
      const errorInput: Domain = {
        domainID: 'domain-repository-error-id',
        dateTime: moment(),
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-1',
        passportNumber: 'A1234567',
      };
      const expectedOutput: Output<boolean> = {
        data: false,
        error: new RError(`Failed validating Domain, Error: ${errorString}`, domainErrorCode.default),
      };

      jest.spyOn(lodash, 'isEmpty').mockImplementation(() => { throw new Error(errorString); });

      expect(domainValidator.isValid(errorInput)).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return invalid output', async () => {
      const validInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment(),
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-1',
        passportNumber: 'A1234567',
      };
      const expectedOutput: Output<boolean> = {
        data: true,
      };
      expect(domainValidator.isValid(validInput)).toEqual(expectedOutput);
    });
  });
});
