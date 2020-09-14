import { Secrets } from '../types/secrets.type';
import { LocalKeyVaultManagementService } from '../secrets';
import { RError } from '../../error/types/error.type';
import { Output } from '../types/output.type';

let secretsService: Secrets;

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();

  secretsService = new LocalKeyVaultManagementService();
});

describe('GIVEN `getValue` method in `secrets` module', () => {
  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const undefinedOutput = await secretsService.getValue(undefined);
      const nullOutput = await secretsService.getValue(null);
      const emptyOutput = await secretsService.getValue('');

      expect(undefinedOutput.error).toBeInstanceOf(RError);
      expect((undefinedOutput.error as RError).code).toBe(40003);
      expect((undefinedOutput.error as RError).httpStatusCode).toBe(500);
      expect(undefinedOutput.data).toBeNull();

      expect(nullOutput.error).toBeInstanceOf(RError);
      expect((nullOutput.error as RError).code).toBe(40003);
      expect((nullOutput.error as RError).httpStatusCode).toBe(500);
      expect(nullOutput.data).toBeNull();

      expect(emptyOutput.error).toBeInstanceOf(RError);
      expect((emptyOutput.error as RError).code).toBe(40003);
      expect((emptyOutput.error as RError).httpStatusCode).toBe(500);
      expect(emptyOutput.data).toBeNull();
    });
  });

  describe('WHEN its invoked with valid input', () => {
    test('THEN it should return valid output', async () => {
      const expectedOutput: Output<string> = {
        data: 'test-domain-api-key',
      };

      const validOutput = await secretsService.getValue('DOMAIN_API_KEY');

      expect(validOutput.error).toBeUndefined();
      expect(validOutput).toEqual(expectedOutput);
    });
  });
});
