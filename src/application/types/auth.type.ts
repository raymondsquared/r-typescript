interface AuthorizationToken {
  accountID: string;
  givenName: string;
  familyName: string;

  // Custom API scope rather than the OIDC scope
  // REF: https://auth0.com/docs/get-started/apis/scopes/openid-connect-scopes
  scope?: string;
}

type ScopePermissions = string[];

interface AuthRequest {
  accountID: string;
  givenName: string;
  familyName: string;
  scopes?: ScopePermissions;
}

export { AuthorizationToken, AuthRequest, ScopePermissions };
