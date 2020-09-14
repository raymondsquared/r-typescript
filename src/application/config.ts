import { config as dotEnvConfig } from 'dotenv';
import { DEFAULT } from '../modules/common/constants';

import { Config, Environment } from './types/config.type';

const environment = (process.env.NODE_ENV || DEFAULT.NODE_ENV) as Environment;

let path: string;
switch (environment) {
  case 'production':
    path = `${__dirname}/../../.env.production`;
    break;
  case 'staging':
    path = `${__dirname}/../../.env.staging`;
    break;
  case 'test':
    path = `${__dirname}/../../.env.test`;
    break;
  case 'development':
    path = `${__dirname}/../../.env.development`;
    break;
  case 'local':
  default:
    path = `${__dirname}/../../.env`;
}
dotEnvConfig({ path });

const config: Config = {
  environment,
  apiPort: parseInt(process.env.API_PORT, 10) || DEFAULT.API_PORT,
  domainAPIURL: process.env.DOMAIN_API_URL,
  corsWhitelistURLs: process.env.CORS_WHITELIST_URLS?.split(',') || null,
};

export default config;
