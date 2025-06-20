import { NextFunction, Response } from 'express';
import env from '../env';
import jwt from 'jsonwebtoken';
import { HttpRequest } from '../types';
import { AuthFailError } from '../utils';

const requireAuthorizedUser = (req: HttpRequest, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers['authorization'];
    const jwtToken = bearerToken?.split(' ')[1];

    if (!jwtToken) {
      throw new AuthFailError('Unauthorized: No token provided');
    }

    const payload = jwt.verify(jwtToken, env.JWT_SECRET);

    if (!payload.sub) {
      throw new AuthFailError('Unauthorized: Invalid token');
    }

    req.getSubject = () => String(payload.sub);
    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuthorizedUser;
