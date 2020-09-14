import { ObservabilityClient } from '../observability-client';

const observabilityClient = new ObservabilityClient();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `ObservabilityClient` module', () => {
  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      let errorOutput: Error;

      try {
        await observabilityClient.create('key', 1);
        await observabilityClient.increase('key', 1);
        await observabilityClient.decrease('key', 1);
      } catch (error) {
        errorOutput = error;
      }

      expect(errorOutput).toBeUndefined();
    });
  });
});
