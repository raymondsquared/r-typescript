import { isEmpty } from 'lodash';

import { DomainValidator } from '../validators/domain.validator';
import { Domain } from '../types/domain.type';
import { RError } from '../../error/types/error.type';
import { Output } from '../../common/types/output.type';
import { DomainRepository } from '../types/repository.type';
import { DomainService } from '../types/service.type';
import { Validator } from '../../common/validator.type';
import { domainErrorCode, serviceErrorCode } from '../../error/error.codes';

class MainDomainService implements DomainService {
  private readonly domainValidator: Validator<Domain>;

  private readonly domainRepository: DomainRepository;

  constructor(domainRepository: DomainRepository) {
    this.domainValidator = new DomainValidator();
    this.domainRepository = domainRepository;
  }

  async getOneDomain(domainID: string): Promise<Output<Domain>> {
    let output: Output<Domain> = {
      data: null,
    };

    try {
      if (!domainID) {
        output.error = new RError('Invalid ID', serviceErrorCode.invalidInput);
        return output;
      }

      output = await this.domainRepository.readOneDomain(domainID);
      if (isEmpty(output.error)
      && !isEmpty(output.data)
      && !this.domainValidator.isValid(output.data)?.data) {
        output.error = new RError(`Invalid Domain, ID: ${output.data?.domainID}`, domainErrorCode.default);
        output.data = null;
      }
    } catch (error) {
      output.error = new RError(`Failed getting one Domain, ${error}`, domainErrorCode.default);
    }

    return output;
  }
}

export { MainDomainService };
