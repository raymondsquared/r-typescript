import OpossumCircuitBreaker from 'opossum';

import { CircuitBreaker } from './types/circuit-breaker.type';
import { CONFIG } from './constants';

const createCircuitBreaker = (inputFunction: any): CircuitBreaker => new OpossumCircuitBreaker(
  inputFunction,
  {
    timeout: CONFIG.CIRCUIT_BREAKER.TIMEOUT_IN_SECONDS * 1000,
    errorThresholdPercentage: CONFIG.CIRCUIT_BREAKER.ERROR_THRESHOLD_PERCENTAGE,
    resetTimeout: CONFIG.CIRCUIT_BREAKER.RESET_TIMEOUT_IN_SECONDS * 1000,
  },
);

export { createCircuitBreaker };
