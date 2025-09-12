import { Request } from 'express';
import { Userpayload } from './user-payload.interface';

export interface AuthenticatedRequest extends Request {
  user: Userpayload;
}
