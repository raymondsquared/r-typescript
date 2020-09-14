import winston from 'winston';

import { Logger } from './types/logger.type';

// TO DO:
// We can even use this to publish to streaming platform,
// such as AWS Kinesis / Azure Event Hubs later or to custom Log Forwarder
// maybe even to AWS Firelens
const logger: Logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
  ],
});

export { logger };
