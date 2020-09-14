import { RError } from '../error.type';

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `constructor` method in `Error` module', () => {
  describe('WHEN it is invoked with empty input', () => {
    test('THEN it should return default output', async () => {
      const expectedOutput = new RError('Unknown Error', 500, 500);

      const errorOutput = new RError();

      expect(errorOutput).toEqual(expectedOutput);
    });
  });

  describe('WHEN it is invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const errorOutput = new RError('valid-error', 123, 456);

      expect(errorOutput.name).toEqual('Error');
      expect(errorOutput.errorString).toEqual('valid-error');
      expect(errorOutput.code).toEqual(123);
      expect(errorOutput.httpStatusCode).toEqual(456);
    });
  });
});
