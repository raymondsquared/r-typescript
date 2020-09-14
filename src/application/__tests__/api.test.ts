import supertest from 'supertest';

import expressAPIApp from '../api';

jest.mock('../config', () => ({
  config: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN empty path', () => {
  describe('WHEN its invoked with empty input', () => {
    test('THEN it should return invalid output', async () => {
      const baseOutput = await supertest(expressAPIApp)
        .get('/');

      expect(baseOutput.statusCode).toBe(404);
      expect(baseOutput.text).toBe('');
    });
  });
});

describe('GIVEN `/health-check` path', () => {
  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const healthCheckOutput = await supertest(expressAPIApp)
        .get('/health-check');

      expect(healthCheckOutput.statusCode).toBe(200);
      expect(healthCheckOutput.headers['content-type']).toContain('text/html');
      expect(healthCheckOutput.text).toBe('Healthy!');
    });
  });
});
