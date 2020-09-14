import axios from 'axios';
import supertest from 'supertest';

import { testAuthorizationHeaderToken } from '../../modules/common/test-data';
import { Output } from '../../modules/common/types/output.type';
import { DomainEntity } from '../../modules/domain/types/entity.type';
import { RError } from '../../modules/error/types/error.type';

import expressAPIApp from '../api';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// REF: https://github.com/facebook/jest/issues/2582
jest.mock('../../modules/domain/adapters/dto.adapter', () => ({
  DomainDTOAdapter: jest.fn().mockImplementation(() => ({
    to: () => ({
      data: null,
      error: new RError('dto-adapter-error', 123),
    }),
  })),
}));

describe('GIVEN `/api/v1/domain/:domain-id` path', () => {
  describe('WHEN its invoked with service error', () => {
    test('THEN it should return invalid output', async () => {
      const validOutput: Output<DomainEntity> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: '2020-12-24T13:14:15.000Z',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-3',
          passportNumber: 'A1234567',
        },
      };
      mockAxios.get.mockResolvedValueOnce(validOutput);

      const errorOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/valid-id')
        .set('Authorization', testAuthorizationHeaderToken.notExpiredDomainAllAccess);

      expect(errorOutput.statusCode).toBe(500);
      expect(errorOutput.headers['content-type']).toContain('application/json');
      expect(errorOutput.body?.error?.errorString).toEqual('dto-adapter-error');
      expect(errorOutput.body?.error?.code).toEqual(123);
      expect(errorOutput.body?.error?.httpStatusCode).toEqual(500);
      expect(errorOutput.body?.data).toBeUndefined();
    });
  });
});
