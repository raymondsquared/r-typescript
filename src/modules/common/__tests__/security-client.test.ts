import { rawLocalDomainData } from '../../domain/repositories/data';
import { DomainEntity } from '../../domain/types/entity.type';
import { SecurityClient } from '../security-client';

const securityClient = new SecurityClient();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `mask` method in `SecurityClient` module', () => {
  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const nullMaskOutput = await securityClient.mask(null, null);
      const emptyRawDataMaskOutput = await securityClient.mask([], null);

      expect(nullMaskOutput).toBeNull();
      expect(emptyRawDataMaskOutput).toEqual(emptyRawDataMaskOutput);
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const columnNamesInput = ['dateTime', 'passportNumber', 'numeric'];
      const expectedColumnNamesValidOutput = [
        {
          domainID: 'domain-id-1',
          dateTime: '9999-99-99X99:99:99.999X',
          isValidated: true,
          numeric: 9,
          ownerAccountID: 'account-id-3',
          passportNumber: 'X9999999',
        },
        {
          domainID: 'domain-id-2',
          dateTime: '9999-99-99X99:99:99.999X',
          isValidated: true,
          numeric: 9,
          ownerAccountID: 'account-id-2',
          passportNumber: 'X9999999',
        },
        {
          domainID: 'domain-id-3',
          dateTime: '9999-99-99X99:99:99.999X',
          isValidated: true,
          numeric: 9,
          ownerAccountID: 'account-id-3',
          passportNumber: 'X9999999',
        },
      ] as DomainEntity[];

      const columnNamesValidOutput = await securityClient.mask(
        rawLocalDomainData,
        columnNamesInput,
      );
      const nullColumnNamesValidOutput = await securityClient.mask(
        rawLocalDomainData,
        null,
      );
      const emptyColumnNamesValidOutput = await securityClient.mask(
        rawLocalDomainData,
        [],
      );

      expect(columnNamesValidOutput).toEqual(expectedColumnNamesValidOutput);
      expect(nullColumnNamesValidOutput).toEqual(rawLocalDomainData);
      expect(emptyColumnNamesValidOutput).toEqual(rawLocalDomainData);
    });
  });
});
