import { createServer as createHTTPServer, Server } from 'http';
import { v4 as uuidV4 } from 'uuid';

import config from './application/config';
import { logger } from './modules/common/logger';
import expressAPIApp from './application/api';
import { OBSERVABILITY } from './modules/common/constants';

// TO DO: initialise observability here to capture default metrics

logger.info(
  `API is running on port:${config.apiPort}`,
  {
    id: uuidV4(),
    dateTime: new Date().toISOString(),
    serviceID: OBSERVABILITY.SERVICE_ID,
    serviceType: OBSERVABILITY.SERVICE_TYPE.API,
  },
);
const server: Server = createHTTPServer(expressAPIApp).listen(config.apiPort);

process.on('SIGTERM', () => {
  logger.warn(
    'SIGTERM signal received, shutting service down.',
    {
      id: uuidV4(),
      dateTime: new Date().toISOString(),
      serviceID: OBSERVABILITY.SERVICE_ID,
      serviceType: OBSERVABILITY.SERVICE_TYPE.API,
    },
  );

  server.close(() => {
    logger.warn(
      'HTTP server closed.',
      {
        id: uuidV4(),
        dateTime: new Date().toISOString(),
        serviceID: OBSERVABILITY.SERVICE_ID,
        serviceType: OBSERVABILITY.SERVICE_TYPE.API,
      },
    );
    // TO DO: Close data access layer
  });
});
