import { AES, enc } from 'crypto-js';
import { isEmpty } from 'lodash';

import { Domain } from '../types/domain.type';
import { RError } from '../../error/types/error.type';
import { Output } from '../../common/types/output.type';
import { DomainRepository } from '../types/repository.type';
import { moduleErrorCode, repositoryErrorCode } from '../../error/error.codes';
import { DomainEntity } from '../types/entity.type';
import Adapter from '../../common/types/adapter.type';
import { DomainEntityAdapter } from '../adapters/entity.adapter';
import { encryptedLocalDomainData } from './data';
import { DEFAULT } from '../../common/constants';
import { testDomainData } from '../../common/test-data';

class LocalDomainRepository implements DomainRepository {
  private readonly domainEntityAdapter: Adapter<Domain, DomainEntity>;

  private readonly data: DomainEntity[];

  constructor() {
    this.domainEntityAdapter = new DomainEntityAdapter();
    this.data = JSON.parse(
      AES.decrypt(encryptedLocalDomainData, DEFAULT.LOCAL_DATABASE_SECRET).toString(enc.Utf8),
    ) as DomainEntity[];
  }

  async readOneDomain(domainID: string): Promise<Output<Domain>> {
    const output: Output<Domain> = {
      data: null,
    };

    try {
      if (!domainID) {
        output.error = new RError('Invalid ID', repositoryErrorCode.invalidInput);
        return output;
      }

      if (domainID === 'http-client-error-id') {
        output.error = new RError('Expected HTTP client error', moduleErrorCode.http);
      }

      let localDataOuput: DomainEntity = this.data.find((datum) => datum.domainID === domainID);

      if (domainID === 'domain-repository-error-id') {
        localDataOuput = testDomainData.errorDateTime;
      }

      if (!isEmpty(localDataOuput)) {
        const adapterOutput = this.domainEntityAdapter.from(localDataOuput);
        if (adapterOutput.error) { throw adapterOutput.error; }
        output.data = adapterOutput.data;
      }
    } catch (error) {
      output.error = new RError(`Failed reading one Domain, ${error}`, repositoryErrorCode.default);
    }

    return output;
  }
}

export { LocalDomainRepository };
