const DEFAULT = {
  API_PORT: 9000,
  NODE_ENV: 'local',
  ERROR_MESSAGE: 'Unknown Error',

  // FIX ME: Database encryption key shouldn't be here
  LOCAL_DATABASE_SECRET: 'local-database-secret',
};

const CONFIG = {
  CIRCUIT_BREAKER: {
    // If our function takes longer than 5 seconds, trigger a failure
    TIMEOUT_IN_SECONDS: 5,
    // When 50% of requests fail, trip the circuit
    ERROR_THRESHOLD_PERCENTAGE: 50,
    // After 60 seconds, try again
    RESET_TIMEOUT_IN_SECONDS: 60,
  },
  HTTP_CLIENT: {
    TIMEOUT_IN_SECONDS: 5,
  },
};

const REGEX = {
  UPPER_CASE_STRING: /[A-Z]/g as RegExp,
  LOWER_CASE_STRING: /[a-z]/g as RegExp,
  NUMBER: /[0-9]/g as RegExp,
};

const SECURITY = {
  AUTHORIZATION_SCOPE: {
    KEY: {
      ALL: '*',
      CREATE: 'create',
      READ: 'read',
      UPDATE: 'update',
      DELETE: 'delete',
    },
    MODULE: {
      DOMAIN: 'domain',
    },
  },
  CRYPTOGRAPHY: {
    MASK: {
      UPPER_CASE_STRING_REPLACEMENT: 'X',
      LOWER_CASE_STRING_REPLACEMENT: 'x',
      NUMBER_REPLACEMENT: 9,
    },
  },
  // Keys from Key Vault / Key Management Service
  SECRETS_KEY: {
    DOMAIN_API_KEY: 'DOMAIN_API_KEY',
    DOMAIN_API_SECRET: 'DOMAIN_API_SECRET',
    AUTHORIZATION_HEADER_SECRET: 'AUTHORIZATION_HEADER_SECRET',
  },
};

const OBSERVABILITY = {
  METRIC: {
    COUNT_IP_ADDRESSES_THROTTLED: 'count-ip-addresses-throttled',
  },
  SERVICE_ID: 'domain',
  SERVICE_TYPE: {
    API: 'api',
  },
};

export {
  DEFAULT,
  CONFIG,
  REGEX,
  SECURITY,
  OBSERVABILITY,
};
