import { AuthRequest } from '../../application/types/auth.type';
import { DomainEntity } from '../domain/types/entity.type';

const testAuthorizationHeaderToken = {
  expiredNoDomainAccess: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOiJhY2NvdW50LWlkLTEiLCJnaXZlbk5hbWUiOiJSYXltb25kIiwiZmFtaWx5TmFtZSI6IkJvbGVzIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjExMTYyMzkwMjIsImlzcyI6Imh0dHBzOi8vaXNzdWVyLmNvbSIsInN1YiI6InN1YmplY3QtaWQiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdCIsImh0dHBzOi8vbG9jYWxob3N0Il19.Zm80M2HVEiZFIoziP8OSfzVDcLVNUj3BeyjBYmiXGTg',
  notExpiredNoDomainAccess: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOiJhY2NvdW50LWlkLTEiLCJnaXZlbk5hbWUiOiJSYXltb25kIiwiZmFtaWx5TmFtZSI6IkJvbGVzIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjMxMTYyMzkwMjIsImlzcyI6Imh0dHBzOi8vaXNzdWVyLmNvbSIsInN1YiI6InN1YmplY3QtaWQiLCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdCIsImh0dHBzOi8vbG9jYWxob3N0Il19.RL15_MlOnwr4piaDI2TsadL038gwnxqkO__aiRPYSy4',
  notExpireDomainCreateReadAccess: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOiJhY2NvdW50LWlkLTIiLCJnaXZlbk5hbWUiOiJSYXltb25kIDIiLCJmYW1pbHlOYW1lIjoiQm9sZXMyIiwic2NvcGUiOiJjcmVhdGU6ZG9tYWluIHJlYWQ6ZG9tYWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjMxMTYyMzkwMjIsImlzcyI6Imh0dHBzOi8vaXNzdWVyLmNvbSIsInN1YiI6InN1YmplY3QtaWQtMiIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0IiwiaHR0cHM6Ly9sb2NhbGhvc3QiXX0.a9EU8ZybcghJHkhVd3vgyoc_3rdUwsgH0hWImZ0DN64',
  notExpiredDomainAllAccess: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SUQiOiJhY2NvdW50LWlkLTMiLCJnaXZlbk5hbWUiOiJSYXltb25kIDMiLCJmYW1pbHlOYW1lIjoiQm9sZXMzIiwic2NvcGUiOiIqOmRvbWFpbiBjcmVhdGU6ZG9tYWluMiByZWFkOmRvbWFpbjIiLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MzExNjIzOTAyMiwiaXNzIjoiaHR0cHM6Ly9pc3N1ZXIuY29tIiwic3ViIjoic3ViamVjdC1pZC0zIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3QiLCJodHRwczovL2xvY2FsaG9zdCJdfQ.cGXs545q_I21jd8f6Ir3y3BFdvS1kQ6lLJT0tTD9Ta4',
};

const testDomainData = {
  errorDateTime: {
    domainID: 'domain-repository-error-id',
    dateTime: 'invalid-date',
    isValidated: true,
    numeric: 1,
    ownerAccountID: 'account-id-1',
    passportNumber: 'A1234567',
  } as DomainEntity,
};

const testUserRequest = {
  notExpiredNoDomainAccess: {
    accountID: 'account-id-1',
    givenName: 'Raymond',
    familyName: 'Boles',
  } as AuthRequest,
  notExpireDomainCreateReadAccess: {
    accountID: 'account-id-2',
    givenName: 'Raymond 2',
    familyName: 'Boles2',
    scopes: [
      'create:domain',
      'read:domain',
    ],
  } as AuthRequest,
  notExpiredDomainAllAccess: {
    accountID: 'account-id-3',
    givenName: 'Raymond 3',
    familyName: 'Boles3',
    scopes: [
      '*:domain',
      'create:domain2',
      'read:domain2',
      'create:domain',
      'read:domain',
      'update:domain',
      'delete:domain',
    ],
  } as AuthRequest,
};

export { testAuthorizationHeaderToken, testDomainData, testUserRequest };
