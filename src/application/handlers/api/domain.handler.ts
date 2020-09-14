import {
  RequestHandler,
  Response,
  NextFunction,
} from 'express';
import { isEmpty } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuidV4 } from 'uuid';
import { trim, escape } from 'validator';

import { MainDomainService } from '../../../modules/domain/services/domain.service';
import { LocalDomainRepository } from '../../../modules/domain/repositories/local-domain.repository';
import { RError } from '../../../modules/error/types/error.type';
import { Output } from '../../../modules/common/types/output.type';
import { DomainRepository } from '../../../modules/domain/types/repository.type';
import { DomainService } from '../../../modules/domain/types/service.type';
import { logger } from '../../../modules/common/logger';
import { applicationErrorCode } from '../../../modules/error/error.codes';
import { DomainDTO } from '../../../modules/domain/types/dto.type';
import { APIDomainRepository } from '../../../modules/domain/repositories/api-domain.repository';
import config from '../../config';
import { LocalKeyVaultManagementService } from '../../../modules/common/secrets';
import { SECURITY, OBSERVABILITY } from '../../../modules/common/constants';
import { HTTPRequest } from '../../types/http.type';
import { DomainDTOAdapter } from '../../../modules/domain/adapters/dto.adapter';
import Adapter from '../../../modules/common/types/adapter.type';
import { Domain } from '../../../modules/domain/types/domain.type';

// TO DO:
// Most ot the time these dependency injection should happen inside IoC container,
// rather than manually do them all here

const domainDTOAdapter: Adapter<Domain, DomainDTO> = new DomainDTOAdapter();

let domainService: DomainService;
const secrets = new LocalKeyVaultManagementService();
Promise.all([
  secrets.getValue(SECURITY.SECRETS_KEY.DOMAIN_API_KEY),
  secrets.getValue(SECURITY.SECRETS_KEY.DOMAIN_API_SECRET),
]).then((secretsOutput: Output<string>[]) => {
  const localDomainRepository: DomainRepository = new LocalDomainRepository();
  const apiDomainRepository: DomainRepository = new APIDomainRepository(
    config.domainAPIURL,
    secretsOutput[0]?.data,
    secretsOutput[1]?.data,
  );
  // domainService = new MainDomainService(localDomainRepository);
  domainService = new MainDomainService(apiDomainRepository);
});

const getOneDomainHandler: RequestHandler = async function getOneDomain(
  request: HTTPRequest,
  response: Response,
  nextFunc: NextFunction,
) {
  try {
    const output: Output<DomainDTO> = { data: null };
    const idParam: string = escape(trim(request?.params?.domainID));

    const getOneDomainOutput = await domainService.getOneDomain(idParam);
    output.error = getOneDomainOutput?.error;

    const domainOutputData = getOneDomainOutput?.data;
    if (!isEmpty(domainOutputData)) {
      if (domainOutputData.ownerAccountID
        && domainOutputData.ownerAccountID !== request.auth?.accountID) {
        output.error = new RError('Unauthorized', applicationErrorCode.unauthorized, StatusCodes.FORBIDDEN);
        response.send(output);
        return;
      }

      const adapterOutput = domainDTOAdapter.to(domainOutputData);
      if (adapterOutput.error) { throw adapterOutput.error; }
      output.data = adapterOutput.data;
    }

    response.send(output);
  } catch (error) {
    logger.error(
      `Failed geting one Domain for ${request?.params?.domainID}`,
      {
        id: uuidV4(),
        dateTime: new Date().toISOString(),
        serviceID: OBSERVABILITY.SERVICE_ID,
        serviceType: OBSERVABILITY.SERVICE_TYPE.API,
        errorCode: applicationErrorCode.default,
      },
    );
    if (error instanceof RError === false) {
      error = new RError(error.message, applicationErrorCode.default);
    }
    nextFunc(error);
  }
};

export { getOneDomainHandler };
