import { AES, enc } from 'crypto-js';

import { Output } from './types/output.type';
import { moduleErrorCode } from '../error/error.codes';
import { RError } from '../error/types/error.type';
import { Secrets } from './types/secrets.type';

// FIX ME: This secret should not be here,
// ideally should be generated in the Cloud console (AWS/Azure)
const secret = 'secret-phrase';

// A simple implementation of Azure KeyVault / AWS KMS
// https://azure.microsoft.com/en-au/services/key-vault/
// https://aws.amazon.com/kms/
class LocalKeyVaultManagementService implements Secrets {
  private readonly data: any;

  constructor() {
    this.data = {
      DOMAIN_API_KEY: AES.encrypt('test-domain-api-key', secret),
      DOMAIN_API_SECRET: AES.encrypt('test-domain-api-secret', secret),
      AUTHORIZATION_HEADER_SECRET: AES.encrypt('authorization-header-secret', secret),
    };
  }

  async getValue(key: string): Promise<Output<string>> {
    const output: Output<string> = {
      data: null,
    };

    try {
      if (!key || !this.data[key]) {
        throw new RError('Invalid key');
      }

      output.data = AES.decrypt(this.data[key], secret).toString(enc.Utf8);
    } catch (error) {
      output.error = new RError(error.message, moduleErrorCode.secrets);
    }

    return output;
  }
}

export { LocalKeyVaultManagementService };
