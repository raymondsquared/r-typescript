import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { isEmpty } from 'lodash';
import morgan from 'morgan';

import healthCheckRouter from './routers/health-check.router';
import apiRouter from './routers/api.router';
import apiDocsRouter from './routers/api-docs.router';
import indexRouter from './routers/index.router';
import { errorAdapterMiddleware, errorLoggingMiddleware } from './middlewares/error.middleware';
import { authorizationMiddleware } from './middlewares/auth.middleware';
import config from './config';
import { ipAddressThrottlingMiddleware } from './middlewares/throttling/ip-address-throttling.middleware';

const expressAPIApp = express();

expressAPIApp.use(morgan('tiny'));
expressAPIApp.use(helmet());
expressAPIApp.use(express.json({ limit: '1MB' }));
expressAPIApp.use(express.static('public'));
expressAPIApp.use(bodyParser.json());

// REF: https://github.com/expressjs/cors#configuration-options
const corsOption = { origin: false } as any;
if (!isEmpty(config.corsWhitelistURLs)) corsOption.origin = config.corsWhitelistURLs;
expressAPIApp.use(cors(corsOption));

// Middlewares
expressAPIApp.use(ipAddressThrottlingMiddleware);

// Routers
expressAPIApp.use(indexRouter);
expressAPIApp.use(healthCheckRouter);
expressAPIApp.use(apiDocsRouter);
expressAPIApp.use(authorizationMiddleware, apiRouter);

// Middlewares
expressAPIApp.use(errorLoggingMiddleware);
expressAPIApp.use(errorAdapterMiddleware);

export default expressAPIApp;
