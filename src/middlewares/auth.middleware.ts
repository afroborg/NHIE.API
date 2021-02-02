import { NextFunction, Request, Response } from 'express';
import config from '../config';

export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization !== config.API_KEY)
    return res.status(401).send();
  next();
};
