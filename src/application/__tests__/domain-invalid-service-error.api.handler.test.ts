import supertest from 'supertest';

import { testAuthorizationHeaderToken } from '../../modules/common/test-data';
import expressAPIApp from '../api';

// REF: https://github.com/facebook/jest/issues/2582
jest.mock('../../modules/domain/services/domain.service', () => ({
  MainDomainService: jest.fn().mockImplementation(() => ({
    getOneDomain: () => {
      throw new Error('test-service-error');
    },
  })),
}));

describe('GIVEN `/api/v1/domain/:domain-id` path', () => {
  describe('WHEN its invoked with service error', () => {
    test('THEN it should return invalid output', async () => {
      const errorString = 'test-service-error';

      const errorOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/valid-id')
        .set('Authorization', testAuthorizationHeaderToken.notExpiredDomainAllAccess);

      expect(errorOutput.statusCode).toBe(500);
      expect(errorOutput.headers['content-type']).toContain('application/json');
      expect(errorOutput.body?.error?.errorString).toEqual(errorString);
      expect(errorOutput.body?.error?.code).toEqual(30000);
      expect(errorOutput.body?.error?.httpStatusCode).toEqual(500);
      expect(errorOutput.body?.data).toBeUndefined();
    });
  });
});
