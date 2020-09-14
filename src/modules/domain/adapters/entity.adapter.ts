import { isEmpty } from 'lodash';
import moment from 'moment';

import { Domain } from '../types/domain.type';
import { Output } from '../../common/types/output.type';
import Adapter from '../../common/types/adapter.type';
import { DomainEntity } from '../types/entity.type';
import { RError } from '../../error/types/error.type';
import { moduleErrorCode } from '../../error/error.codes';

class DomainEntityAdapter implements Adapter<Domain, DomainEntity> {
  from(domainEntity: DomainEntity): Output<Domain> {
    const output: Output<Domain> = {
      data: null,
    };

    try {
      if (isEmpty(domainEntity)) {
        throw new RError('Invalid input');
      }

      const dateTimeMoment = moment(domainEntity.dateTime);
      if (!dateTimeMoment.isValid()) throw new RError('Invalid data');

      output.data = {
        domainID: domainEntity.domainID,
        dateTime: dateTimeMoment,
        isValidated: domainEntity.isValidated,
        numeric: domainEntity.numeric,
        ownerAccountID: domainEntity.ownerAccountID,
        passportNumber: domainEntity.passportNumber,
      };
    } catch (error) {
      output.error = new RError(`Failed adapting from Domain Entity to Domain, Error: ${error.message}`, moduleErrorCode.default);
    }

    return output;
  }

  to(domain: Domain): Output<DomainEntity> {
    throw new Error('Method not implemented.');
  }
}

export { DomainEntityAdapter };
