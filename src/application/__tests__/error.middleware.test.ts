import {
  Response,
} from 'express';

import { Output } from '../../modules/common/types/output.type';
import { applicationErrorCode } from '../../modules/error/error.codes';
import { RError } from '../../modules/error/types/error.type';
import { errorAdapterMiddleware } from '../middlewares/error.middleware';

const responseStatusFn = jest.fn();
const responseSendFn = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe('GIVEN `errorAdapterMiddleware` middleware', () => {
  describe('WHEN its invoked with invalid input', () => {
    test('THEN it should return invalid output', async () => {
      const expectedOutput = {
        error: {
          code: applicationErrorCode.default,
          httpStatusCode: 500,
          errorString: 'Unknown Error',
        } as RError,
      } as Output<any>;

      const res = {} as Response;
      res.status = responseStatusFn;
      res.send = responseSendFn;
      const nextFn = jest.fn();

      await errorAdapterMiddleware(null, null, res, nextFn);

      expect(responseStatusFn).toBeCalledWith(500);
      expect(responseSendFn).toBeCalledWith(expectedOutput);
    });
  });

  describe('WHEN its invoked with valid object as input', () => {
    test('THEN it should return valid output', async () => {
      const errorInput = {
        message: 'test-error-message',
        status: 1,
        name: 'test-name',
      };

      const expectedOutput = {
        error: {
          code: 1,
          httpStatusCode: 500,
          errorString: errorInput.message,
        } as RError,
      } as Output<any>;

      const res = {} as Response;
      res.status = responseStatusFn;
      res.send = responseSendFn;

      await errorAdapterMiddleware(errorInput, null, res, jest.fn());

      expect(responseStatusFn).toBeCalledWith(500);
      expect(responseSendFn).toBeCalledWith(expectedOutput);
    });
  });

  describe('WHEN its invoked with valid RError input', () => {
    test('THEN it should return valid output', async () => {
      const httpStatusCodeInput = 1;
      const rErrorInput = new RError('test-r-error', 2, httpStatusCodeInput);

      const expectedOutput = {
        error: {
          code: rErrorInput.code,
          httpStatusCode: rErrorInput.httpStatusCode,
          errorString: rErrorInput.errorString,
        } as RError,
      } as Output<any>;

      const res = {} as Response;
      res.status = responseStatusFn;
      res.send = responseSendFn;

      await errorAdapterMiddleware(rErrorInput, null, res, jest.fn());

      expect(responseStatusFn).toBeCalledWith(httpStatusCodeInput);
      expect(responseSendFn).toBeCalledWith(expectedOutput);
    });
  });
});
