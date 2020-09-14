import { Router } from 'express';
import swaggerUI from 'swagger-ui-express';

import swaggerDocument from '../../swagger.json';

const router = Router();

router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

export default router;
