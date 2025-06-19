import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export function httpLogger(req: Request, res: Response, next: NextFunction) {

  const start = Date.now();
  const { method, url, ip } = req;
  
  next();
  

  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = Date.now() - start;
    
    const logMessage = `${method} ${url} ${statusCode} ${responseTime}ms - ${ip}`;
    
    
    if (statusCode >= 500) {
      logger.error(logMessage);
    } else if (statusCode >= 400) {
      logger.warn(logMessage);
    } else {
      logger.http(logMessage);
    }
  });
}