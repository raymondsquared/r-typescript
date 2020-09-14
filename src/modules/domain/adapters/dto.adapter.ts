import { isEmpty } from 'lodash';

import { Domain } from '../types/domain.type';
import { Output } from '../../common/types/output.type';
import Adapter from '../../common/types/adapter.type';
import { RError } from '../../error/types/error.type';
import { moduleErrorCode } from '../../error/error.codes';
import { DomainDTO } from '../types/dto.type';
import { DomainModel } from '../models/domain.model';

class DomainDTOAdapter implements Adapter<Domain, DomainDTO> {
  from(domainDTO: DomainDTO): Output<Domain> {
    throw new Error('Method not implemented.');
  }

  to(domain: Domain): Output<DomainDTO> {
    const output: Output<DomainDTO> = {
      data: null,
    };

    try {
      const domainModel = new DomainModel(domain);
      if (isEmpty(domain) || isEmpty(domainModel)) {
        throw new RError('Invalid input');
      }

      output.data = {
        domainID: domainModel.domainID,
        dateTime: domainModel.dateTime?.toISOString(),
        info: domainModel.getInfo(),
        isValidated: domainModel.isValidated,
        numeric: domainModel.numeric,
        ownerAccountID: domainModel.ownerAccountID,
        passportNumber: domainModel.passportNumber,
      };
    } catch (error) {
      output.error = new RError(`Failed adapting from Domain to Domain DTO, Error: ${error.message}`, moduleErrorCode.default);
    }

    return output;
  }
}

export { DomainDTOAdapter };
