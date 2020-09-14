import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';

const router = Router();

router.get(
  '/health-check',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_request: Request, response: Response, _nextFunc: NextFunction) => {
    response.send('Healthy!');
  },
);

export default router;
