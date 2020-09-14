import { cloneDeep, isEmpty } from 'lodash';
import { DomainEntity } from '../domain/types/entity.type';
import { REGEX, SECURITY } from './constants';
import { logger } from './logger';
import { SecurityClientInterface } from './types/security.type';

class SecurityClient implements SecurityClientInterface<DomainEntity> {
  async mask(rawData: DomainEntity[], columnNames: string[]): Promise<DomainEntity[]> {
    let output: DomainEntity[] = cloneDeep(rawData);

    try {
      if (!isEmpty(columnNames)) {
        output = output.map<DomainEntity>(
          (row) => {
            const outputRow: DomainEntity = { ...row };
            columnNames.forEach(
              (columnName) => {
                switch (typeof (outputRow[columnName])) {
                  case 'string': {
                    let stringValue = outputRow[columnName].toString();
                    if (stringValue) {
                      stringValue = stringValue.replace(
                        REGEX.UPPER_CASE_STRING,
                        SECURITY.CRYPTOGRAPHY.MASK.UPPER_CASE_STRING_REPLACEMENT,
                      );

                      stringValue = stringValue.replace(
                        REGEX.LOWER_CASE_STRING,
                        SECURITY.CRYPTOGRAPHY.MASK.LOWER_CASE_STRING_REPLACEMENT,
                      );

                      stringValue = stringValue.replace(
                        REGEX.NUMBER,
                        SECURITY.CRYPTOGRAPHY.MASK.NUMBER_REPLACEMENT.toString(),
                      );
                    }
                    outputRow[columnName] = stringValue;
                    break;
                  }
                  case 'number': {
                    let stringValue = outputRow[columnName].toString();
                    if (!Number.isNaN(outputRow[columnName])) {
                      stringValue = stringValue.replace(
                        REGEX.NUMBER,
                        SECURITY.CRYPTOGRAPHY.MASK.NUMBER_REPLACEMENT.toString(),
                      );
                    }
                    outputRow[columnName] = Number(stringValue);
                    break;
                  }
                  default:
                    // Unsupported type for now
                }
              },
            );
            return outputRow as DomainEntity;
          },
        );
      }
    } catch (error) {
      logger.log('verbose', `Failed masking data by ${columnNames.toString()}`);
    }

    return output;
  }
}

export { SecurityClient };
