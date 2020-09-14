/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */

const configFn = jest.fn();
jest.mock('dotenv', () => ({
  config: configFn,
}));

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `config`', () => {
  describe('WHEN its invoked with empty environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: null };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env$') });
    });
  });

  describe('WHEN its invoked with random environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: 'random' };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env$') });
    });
  });

  describe('WHEN its invoked with production environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: 'production' };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env.production$') });
    });
  });

  describe('WHEN its invoked with staging environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: 'staging' };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env.staging$') });
    });
  });

  describe('WHEN its invoked with test environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: 'test' };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env.test$') });
    });
  });

  describe('WHEN its invoked with development environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: 'development' };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env.development$') });
    });
  });

  describe('WHEN its invoked with local environment', () => {
    test('THEN it should return valid output', async () => {
      process.env = { ...process.env, NODE_ENV: 'local' };

      const configOutput = require('../config.ts').default;

      expect(configOutput).not.toBeNull();
      expect(configFn).toBeCalledTimes(1);
      expect(configFn).toBeCalledWith({ path: expect.stringMatching('.env$') });
    });
  });
});
