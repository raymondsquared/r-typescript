import moment from 'moment';

import Adapter from '../../../common/types/adapter.type';
import { Output } from '../../../common/types/output.type';
import { RError } from '../../../error/types/error.type';
import { Domain } from '../../types/domain.type';
import { DomainDTO } from '../../types/dto.type';
import { DomainDTOAdapter } from '../dto.adapter';

let domainDTOAdapter: Adapter<Domain, DomainDTO>;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  domainDTOAdapter = new DomainDTOAdapter();
});

describe('GIVEN `from` method in `DomainDTOAdapter` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', () => {
      expect(() => { domainDTOAdapter.from(null); }).toThrowError();
    });
  });
});

describe('GIVEN `to` method in `DomainDTOAdapter` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', () => {
      const expectedOutput: Output<DomainDTO> = {
        data: null,
        error: new RError('Failed adapting from Domain to Domain DTO, Error: Invalid input'),
      };

      const undefinedOutput = domainDTOAdapter.to(undefined);
      const nullOutput = domainDTOAdapter.to(null);

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

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', () => {
      const validInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment('2020-12-24T13:14:15.000Z'),
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-3',
        passportNumber: 'A1234567',
      };
      const expectedOutput: Output<DomainDTO> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: '2020-12-24T13:14:15.000Z',
          info: 'domain-id-1 was creaed in 2020',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-3',
          passportNumber: 'A1234567',
        },
      };

      const validOutput = domainDTOAdapter.to(validInput);

      expect(validOutput).toEqual(expectedOutput);
      expect(validOutput.error).toBeUndefined();
    });
  });
});
