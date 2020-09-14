import { Request } from 'express';
import { AuthRequest } from './auth.type';

interface HTTPRequest extends Request {
  auth?: AuthRequest;
}

export { HTTPRequest };
