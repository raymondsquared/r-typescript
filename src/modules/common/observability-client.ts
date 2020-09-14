import { logger } from './logger';
import { ObservabilityClientInterface } from './types/observability.type';

// TO DO: Use a more sophisticated 3rd party observability vendor
// (Promotheus, ELK, New Relic, Splunk or DataDog)

class ObservabilityClient implements ObservabilityClientInterface {
  async create(key: string, value: number): Promise<void> {
    logger.log('verbose', `Creating a custom metric ${key} with value ${value}`);
  }

  async increase(key: string, value: number): Promise<void> {
    logger.log('verbose', `Increasing a custom metric ${key} by ${value}`);
  }

  async decrease(key: string, value: number): Promise<void> {
    logger.log('verbose', `Decreasing a custom metric ${key} by ${value}`);
  }
}

export { ObservabilityClient };
