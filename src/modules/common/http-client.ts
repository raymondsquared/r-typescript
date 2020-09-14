import axios, { AxiosRequestConfig } from 'axios';
import { isEmpty } from 'lodash';

import { moduleErrorCode } from '../error/error.codes';
import { RError } from '../error/types/error.type';
import { CONFIG } from './constants';
import { HTTPAuthorization, HTTPClientInterface } from './types/http.type';
import { Output } from './types/output.type';

class HTTPClient implements HTTPClientInterface {
  async get<T>(url: string, authorization: HTTPAuthorization): Promise<Output<T>> {
    const output: Output<T> = {
      data: null,
    };

    try {
      if (!url) {
        throw new Error('Invalid URL');
      }

      const config: AxiosRequestConfig = {
        timeout: CONFIG.HTTP_CLIENT.TIMEOUT_IN_SECONDS * 1000,
      };

      if (!isEmpty(authorization)) {
        config.headers = {
          Authorization: `${authorization.scheme} ${authorization.parameter}`,
        };
      }

      const getOutput = await axios.get<T>(
        url,
        config,
      );
      output.data = getOutput?.data;
    } catch (error) {
      output.error = new RError(error.message, moduleErrorCode.http);
    }
    return output;
  }
}

export { HTTPClient };
