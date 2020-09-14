import { isEmpty } from 'lodash';
import { Moment } from 'moment';
import { Domain } from '../types/domain.type';
import { Validator } from '../../common/validator.type';
import { DomainValidator } from '../validators/domain.validator';
import { Output } from '../../common/types/output.type';

// DomainModel is a Business Domain Model for Domain
// (Similar to Domain Interface but with some logical function)
class DomainModel implements Domain {
  domainID: string;

  dateTime: Moment;

  isValidated: boolean;

  numeric: number;

  ownerAccountID: string;

  passportNumber: string;

  constructor(domain: Domain) {
    const domainValidator: Validator<Domain> = new DomainValidator();
    const isValidDomainOutput: Output<boolean> = domainValidator.isValid(domain);
    if (isEmpty(domain) || isValidDomainOutput.error || !isValidDomainOutput.data) {
      return;
    }

    this.domainID = domain.domainID;
    this.dateTime = domain.dateTime;
    this.isValidated = domain.isValidated;
    this.numeric = domain.numeric;
    this.ownerAccountID = domain.ownerAccountID;
    this.passportNumber = domain.passportNumber;
  }

  getInfo() {
    return `${this.domainID} was creaed in ${this.dateTime.format('YYYY')}`;
  }
}

export { DomainModel };
