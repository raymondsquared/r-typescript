import Adapter from '../../modules/common/types/adapter.type';
import { Output } from '../../modules/common/types/output.type';
import { RError } from '../../modules/error/types/error.type';

import { AuthRequestAdapter, getWildcardScopePermissions } from '../adapters/auth-request.adapter';
import { AuthorizationToken, AuthRequest, ScopePermissions } from '../types/auth.type';

let authRequestAdapter: Adapter<AuthorizationToken, AuthRequest>;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  authRequestAdapter = new AuthRequestAdapter();
});

describe('GIVEN `getWildcardScopePermissions` middleware', () => {
  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedGetOutput = ['random:get'];

      const nullOutput = getWildcardScopePermissions(null);
      const actualOutput = getWildcardScopePermissions([]);
      const getOutput = getWildcardScopePermissions(expectedGetOutput);

      expect(nullOutput).toBeNull();
      expect(actualOutput).toEqual([]);
      expect(getOutput).toEqual(expectedGetOutput);
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const validInput = ['create:domain', '*:domain', 'create:domain2'];
      const expectedOutput = [
        '*:domain',
        'create:domain',
        'read:domain',
        'update:domain',
        'delete:domain',
        'create:domain2',
      ];

      const validOutput = getWildcardScopePermissions(validInput);
      expect(validOutput.sort()).toEqual(expectedOutput.sort());
    });
  });
});

describe('GIVEN `from` method in `AuthRequestAdapter` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', () => {
      expect(() => { authRequestAdapter.from(null); }).toThrowError();
    });
  });
});

describe('GIVEN `to` method in `AuthRequestAdapter` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return invalid output', () => {
      const expectedOutput: Output<AuthRequest> = {
        data: null,
        error: new RError('Failed adapting from Authorization Token to Auth Request, Error: Invalid input'),
      };

      const undefinedOutput = authRequestAdapter.to(undefined);
      const nullOutput = authRequestAdapter.to(null);

      expect(undefinedOutput).toEqual(expectedOutput);
      expect(undefinedOutput.error).toBeInstanceOf(RError);
      expect((undefinedOutput.error as RError).code).toBe(30000);
      expect((undefinedOutput.error as RError).httpStatusCode).toBe(500);

      expect(nullOutput).toEqual(expectedOutput);
      expect(nullOutput.error).toBeInstanceOf(RError);
      expect((nullOutput.error as RError).code).toBe(30000);
      expect((nullOutput.error as RError).httpStatusCode).toBe(500);
    });
  });

  describe('WHEN it is invoked with valid input', () => {
    test('THEN it should return valid output', () => {
      const validInput: AuthorizationToken = {
        accountID: 'account-id-3',
        givenName: 'Raymond 3',
        familyName: 'Boles3',
        scope: '*:domain create:domain2 read:domain2',
      };
      const expectedOutput: Output<AuthRequest> = {
        data: {
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
          ] as ScopePermissions,
        },
      };

      const validOutput = authRequestAdapter.to(validInput);

      expect(validOutput).toEqual(expectedOutput);
      expect(validOutput.error).toBeUndefined();
    });
  });
});
