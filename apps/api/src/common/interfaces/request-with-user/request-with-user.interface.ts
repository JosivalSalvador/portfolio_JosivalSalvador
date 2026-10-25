import type { Request } from 'express';
import type { AuthUser } from '../auth-user/auth-user.interface.js';

export interface RequestWithUser extends Request {
  user?: AuthUser;
}