import axios from 'axios';
import supertest from 'supertest';

import { testAuthorizationHeaderToken, testDomainData } from '../../modules/common/test-data';
import { Output } from '../../modules/common/types/output.type';
import { DomainDTO } from '../../modules/domain/types/dto.type';
import { DomainEntity } from '../../modules/domain/types/entity.type';

import expressAPIApp from '../api';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN /api/v1/domain/:domain-id path', () => {
  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const httpClientErrorMesage = 'Expected HTTP client error';

      mockAxios.get.mockRejectedValueOnce(new Error(httpClientErrorMesage));

      const invalidOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/http-client-error-id')
        .set('Authorization', testAuthorizationHeaderToken.notExpiredDomainAllAccess);

      expect(invalidOutput.statusCode).toBe(200);
      expect(invalidOutput.headers['content-type']).toContain('application/json');
      expect(invalidOutput.body?.error?.httpStatusCode).toEqual(500);
      expect(invalidOutput.body?.error?.code).toEqual(40002);
      expect(invalidOutput.body?.error?.errorString).toEqual(httpClientErrorMesage);
      expect(invalidOutput.body?.data).toBeNull();
    });
  });

  describe('WHEN its invoked with repository error', () => {
    test('THEN it should return invalid output', async () => {
      const expectedInvalidOutput: Output<DomainEntity> = {
        data: testDomainData.errorDateTime,
      };

      mockAxios.get.mockResolvedValueOnce(expectedInvalidOutput);

      const errorOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/domain-repository-error-id')
        .set('Authorization', testAuthorizationHeaderToken.notExpiredDomainAllAccess);

      expect(errorOutput.statusCode).toBe(200);
      expect(errorOutput.headers['content-type']).toContain('application/json');
      expect(errorOutput.body?.error?.httpStatusCode).toEqual(500);
      expect(errorOutput.body?.error?.code).toEqual(70000);
      expect(errorOutput.body?.error?.errorString).toEqual('Failed reading one Domain, Error: Failed adapting from Domain Entity to Domain, Error: Invalid data');
      expect(errorOutput.body?.data).toBeNull();
    });
  });

  describe('WHEN its invoked with validation error', () => {
    test('THEN it should return invalid output', async () => {
      const expectedInvalidOutput: Output<DomainEntity> = {
        data: testDomainData.errorDateTime,
      };

      mockAxios.get.mockResolvedValueOnce(expectedInvalidOutput);

      const errorOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/domain-repository-error-id')
        .set('Authorization', testAuthorizationHeaderToken.notExpiredDomainAllAccess);

      expect(errorOutput.statusCode).toBe(200);
      expect(errorOutput.headers['content-type']).toContain('application/json');
      expect(errorOutput.body?.error?.httpStatusCode).toEqual(500);
      expect(errorOutput.body?.error?.code).toEqual(70000);
      expect(errorOutput.body?.error?.errorString).toEqual('Failed reading one Domain, Error: Failed adapting from Domain Entity to Domain, Error: Invalid data');
      expect(errorOutput.body?.data).toBeNull();
    });
  });

  describe('WHEN its invoked with invalid authorization - access control', () => {
    test('THEN it should return invalid output', async () => {
      const expectedInvalidOutput: Output<DomainEntity> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: '2020-12-24T13:14:15.000Z',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-3',
          passportNumber: 'A1234567',
        },
      };

      mockAxios.get.mockResolvedValueOnce(expectedInvalidOutput);

      const invalidOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/domain-id-1')
        .set('Authorization', testAuthorizationHeaderToken.notExpireDomainCreateReadAccess);

      expect(invalidOutput.statusCode).toBe(200);
      expect(invalidOutput.headers['content-type']).toContain('application/json');
      expect(invalidOutput.body?.error?.httpStatusCode).toEqual(403);
      expect(invalidOutput.body?.error?.code).toEqual(30002);
      expect(invalidOutput.body?.error?.errorString).toEqual('Unauthorized');
      expect(invalidOutput.body?.data).toBeNull();
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const expectedValidOutput: Output<DomainDTO> = {
        data: {
          domainID: 'domain-id-1',
          dateTime: '2020-12-24T13:14:15.000Z',
          info: 'domain-id-1 was creaed in 2020',
          isValidated: true,
          numeric: 1,
          ownerAccountID: 'account-id-3',
          passportNumber: 'A1234567',
        },
      };

      mockAxios.get.mockResolvedValueOnce(expectedValidOutput);

      const validOutput = await supertest(expressAPIApp)
        .get('/api/v1/domain/domain-id-1')
        .set('Authorization', testAuthorizationHeaderToken.notExpiredDomainAllAccess);

      expect(validOutput.statusCode).toBe(200);
      expect(validOutput.headers['content-type']).toContain('application/json');
      expect(validOutput.body?.error).toBeUndefined();
      expect(validOutput.body?.data).toEqual(expectedValidOutput.data);
    });
  });
});
