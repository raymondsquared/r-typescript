import moment from 'moment';
import { Domain } from '../../types/domain.type';
import { DomainModel } from '../domain.model';

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `DomainModel` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const undefinedDomainModelOutput = new DomainModel(undefined);
      const nullDomainModelOutput = new DomainModel(null);
      const emptyDomainModelOutput = new DomainModel({} as Domain);

      expect(undefinedDomainModelOutput).toEqual({} as DomainModel);
      expect(nullDomainModelOutput).toEqual({} as DomainModel);
      expect(emptyDomainModelOutput).toEqual({} as DomainModel);
    });
  });

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const validInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment('2020-12-24T13:14:15.000Z'),
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-3',
        passportNumber: 'A1234567',
      };

      const invalidDomainIDDomainModelOutput = new DomainModel({ ...validInput, domainID: '' });
      const invalidOwnerAccountIDDomainModelOutput = new DomainModel({ ...validInput, ownerAccountID: '' });
      const invalidPasswordNumberDomainModelOutput = new DomainModel({ ...validInput, passportNumber: '' });

      expect(invalidDomainIDDomainModelOutput).toEqual({} as DomainModel);
      expect(invalidOwnerAccountIDDomainModelOutput).toEqual({} as DomainModel);
      expect(invalidPasswordNumberDomainModelOutput).toEqual({} as DomainModel);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const invalidInput: Domain = {
        domainID: 'domain-id-1',
        dateTime: moment('2020-12-24T13:14:15.000Z'),
        isValidated: true,
        numeric: 1,
        ownerAccountID: 'account-id-3',
        passportNumber: 'A1234567',
      };

      const invalidDomainModelOutput = new DomainModel(invalidInput);

      expect(invalidDomainModelOutput).toEqual(invalidInput);
      expect(invalidDomainModelOutput.getInfo()).toEqual('domain-id-1 was creaed in 2020');
    });
  });
});
