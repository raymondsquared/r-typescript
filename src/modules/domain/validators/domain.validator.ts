import { isEmpty } from 'lodash';

import { Domain } from '../types/domain.type';
import { Output } from '../../common/types/output.type';
import { Validator } from '../../common/validator.type';
import { RError } from '../../error/types/error.type';
import { moduleErrorCode } from '../../error/error.codes';

class DomainValidator implements Validator<Domain> {
  isValid(domain: Domain): Output<boolean> {
    const output: Output<boolean> = {
      data: false,
    };

    try {
      if (
        isEmpty(domain)
        || !domain.domainID
        || domain.numeric <= 0
        || !Number.isFinite(domain.numeric)
        || !domain.ownerAccountID
        || !domain.passportNumber
      ) {
        return output;
      }

      output.data = true;
    } catch (error) {
      output.error = new RError(`Failed validating Domain, Error: ${error.message}`, moduleErrorCode.default);
    }

    return output;
  }
}

export { DomainValidator };
