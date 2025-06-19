import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`${err.message} - ${err.stack}`);
  res.status(500).json({ message: 'Internal Server Error' });
}
