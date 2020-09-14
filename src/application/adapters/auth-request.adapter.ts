import { cloneDeep, isEmpty, uniq } from 'lodash';
import { SECURITY } from '../../modules/common/constants';

import Adapter from '../../modules/common/types/adapter.type';
import { Output } from '../../modules/common/types/output.type';
import { applicationErrorCode } from '../../modules/error/error.codes';
import { RError } from '../../modules/error/types/error.type';
import { AuthorizationToken, AuthRequest, ScopePermissions } from '../types/auth.type';

const getWildcardScopePermissions = (scopePermissions: ScopePermissions): ScopePermissions => {
  let output: ScopePermissions = cloneDeep(scopePermissions);

  try {
    const regex = /^(\*:)/;
    scopePermissions.forEach(
      (scopePermission) => {
        if (scopePermission?.match(regex)) {
          const scopePermissionKey = scopePermission.replace('*:', '');
          output.push(`${SECURITY.AUTHORIZATION_SCOPE.KEY.CREATE}:${scopePermissionKey}`);
          output.push(`${SECURITY.AUTHORIZATION_SCOPE.KEY.READ}:${scopePermissionKey}`);
          output.push(`${SECURITY.AUTHORIZATION_SCOPE.KEY.UPDATE}:${scopePermissionKey}`);
          output.push(`${SECURITY.AUTHORIZATION_SCOPE.KEY.DELETE}:${scopePermissionKey}`);
        }
      },
    );

    output = uniq(output);
  // eslint-disable-next-line no-empty
  } catch (error) {}

  return output;
};

class AuthRequestAdapter implements Adapter<AuthorizationToken, AuthRequest> {
  from(authRequest: AuthRequest): Output<AuthorizationToken> {
    throw new Error('Method not implemented.');
  }

  to(authorizationToken: AuthorizationToken): Output<AuthRequest> {
    const output: Output<AuthRequest> = {
      data: null,
    };

    try {
      if (isEmpty(authorizationToken)) {
        throw new RError('Invalid input');
      }

      let scopePermissions: ScopePermissions = authorizationToken?.scope?.split(' ');
      if (!isEmpty(scopePermissions)) {
        scopePermissions = getWildcardScopePermissions(scopePermissions);
      }

      output.data = {
        accountID: authorizationToken.accountID,
        givenName: authorizationToken.givenName,
        familyName: authorizationToken.familyName,
        scopes: scopePermissions,
      };
    } catch (error) {
      output.error = new RError(`Failed adapting from Authorization Token to Auth Request, Error: ${error.message}`, applicationErrorCode.default);
    }

    return output;
  }
}

export { AuthRequestAdapter, getWildcardScopePermissions };
