import { Moment } from 'moment';

// Domain is a Business Domain Interface for Domain
// (Similar to Domain Model but without some logical function)

interface Domain {
  domainID: string;
  dateTime: Moment;
  isValidated: boolean;
  numeric: number;
  ownerAccountID: string;
  passportNumber: string;
}

export { Domain };
