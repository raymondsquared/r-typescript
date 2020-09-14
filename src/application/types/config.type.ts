type Environment = 'local' | 'development' | 'test' | 'staging' | 'production';

interface Config {
  environment: Environment;
  apiPort: number;
  domainAPIURL: string;
  corsWhitelistURLs: string[];
}

export { Config, Environment };
