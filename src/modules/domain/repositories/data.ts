import { AES } from 'crypto-js';
import { DEFAULT } from '../../common/constants';
import { DomainEntity } from '../types/entity.type';

const rawLocalDomainData = [
  {
    domainID: 'domain-id-1',
    dateTime: '2020-12-24T13:14:15.000Z',
    isValidated: true,
    numeric: 1,
    ownerAccountID: 'account-id-3',
    passportNumber: 'A1234567',
  },
  {
    domainID: 'domain-id-2',
    dateTime: '2020-12-24T13:14:15.000Z',
    isValidated: true,
    numeric: 2,
    ownerAccountID: 'account-id-2',
    passportNumber: 'B1234567',
  },
  {
    domainID: 'domain-id-3',
    dateTime: '2020-12-24T13:14:15.000Z',
    isValidated: true,
    numeric: 3,
    ownerAccountID: 'account-id-3',
    passportNumber: 'C1234567',
  },
] as DomainEntity[];

const encryptedLocalDomainData = AES.encrypt(
  JSON.stringify(rawLocalDomainData),
  DEFAULT.LOCAL_DATABASE_SECRET,
);

export { rawLocalDomainData, encryptedLocalDomainData };
