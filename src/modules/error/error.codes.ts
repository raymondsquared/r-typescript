const genericErrorCode = {
  default: 10000,
};

const infrastructureErrorCode = {
  default: 20000,
};

const applicationErrorCode = {
  default: 30000,
  invalidInput: 30001,
  unauthorized: 30002,
  throttled: 30003,
};

const moduleErrorCode = {
  default: 40000,
  invalidInput: 40001,
  http: 40002,
  secrets: 40003,
};

const domainErrorCode = {
  default: 50000,
};

const serviceErrorCode = {
  default: 60000,
  invalidInput: 60001,
};

const repositoryErrorCode = {
  default: 70000,
  invalidInput: 70001,
};

export {
  applicationErrorCode,
  domainErrorCode,
  genericErrorCode,
  infrastructureErrorCode,
  moduleErrorCode,
  repositoryErrorCode,
  serviceErrorCode,
};
