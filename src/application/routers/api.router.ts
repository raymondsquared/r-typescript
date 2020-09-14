import {
  Router,
} from 'express';
import { SECURITY } from '../../modules/common/constants';

import { getOneDomainHandler } from '../handlers/api/domain.handler';
import { getAuthorizationHandler } from '../handlers/api/auth.handler';
import { getCustomerHandler } from '../handlers/api/customer.handler';

const router = Router();

router.get(
  '/api/v1/domain/:domainID',
  getAuthorizationHandler([
    `${SECURITY.AUTHORIZATION_SCOPE.KEY.READ}:${SECURITY.AUTHORIZATION_SCOPE.MODULE.DOMAIN}`,
  ]),
  getCustomerHandler(
    'get-domain-model',
  ),
  getOneDomainHandler,
);

export default router;
