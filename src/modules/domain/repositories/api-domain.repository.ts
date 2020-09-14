import { isEmpty } from 'lodash';

import { Domain } from '../types/domain.type';
import { RError } from '../../error/types/error.type';
import { Output } from '../../common/types/output.type';
import { DomainRepository } from '../types/repository.type';
import { repositoryErrorCode } from '../../error/error.codes';
import { HTTPAuthorization, HTTPClientInterface } from '../../common/types/http.type';
import { DomainEntity } from '../types/entity.type';
import { HTTPClient } from '../../common/http-client';
import { createCircuitBreaker } from '../../common/circuit-breaker';
import Adapter from '../../common/types/adapter.type';
import { DomainEntityAdapter } from '../adapters/entity.adapter';
import { CircuitBreaker } from '../../common/types/circuit-breaker.type';

class APIDomainRepository implements DomainRepository {
  private readonly httpClient: HTTPClientInterface;

  private readonly domainEntityAdapter: Adapter<Domain, DomainEntity>;

  private readonly baseURL: string;

  private readonly apiKey: string;

  private readonly apiSecret: string;

  private readonly circuitBreaker: CircuitBreaker;

  constructor(baseURL: string, apiKey: string, apiSecret: string) {
    this.httpClient = new HTTPClient();
    this.domainEntityAdapter = new DomainEntityAdapter();
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.circuitBreaker = createCircuitBreaker(
      async (
        url: string,
        authorization: HTTPAuthorization,
      ) => this.httpClient.get<DomainEntity>(
        url,
        authorization,
      ),
    );
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

      const url = new URL(`${this.baseURL}/api/v1/domain/${domainID}`);
      await this.circuitBreaker?.fire(url.toString(), this.getAPIAuthorizationToken())
        .then((getDomainEntityFromAPIOutput: Output<DomainEntity>) => {
          if (getDomainEntityFromAPIOutput?.error) {
            output.error = getDomainEntityFromAPIOutput?.error;
          }

          const apiDataOutput: DomainEntity = getDomainEntityFromAPIOutput?.data;
          if (!isEmpty(apiDataOutput)) {
            const adapterOutput = this.domainEntityAdapter.from(apiDataOutput);
            if (adapterOutput.error) { throw adapterOutput.error; }
            output.data = adapterOutput.data;
          }
        });
    } catch (error) {
      output.error = new RError(`Failed reading one Domain, Error: ${error.message}`, repositoryErrorCode.default);
    }

    return output;
  }

  // TO DO:
  // - fetch authorization token
  // - deal with expiry and refresh token
  private async getAPIAuthorizationToken(): Promise<HTTPAuthorization> {
    return {
      scheme: 'Bearer',
      parameter: '1234-abcd',
    };
  }
}

export { APIDomainRepository };
