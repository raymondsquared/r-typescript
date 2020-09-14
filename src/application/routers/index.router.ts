import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_request: Request, response: Response, _nextFunc: NextFunction) => {
    response
      .status(StatusCodes.NOT_FOUND)
      .send();
  },
);

export default router;
