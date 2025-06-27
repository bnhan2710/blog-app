import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
export class ErrorHandler {
  static handle(): ErrorRequestHandler {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      if (res.headersSent) {
        return next(err);
      }

      if (err instanceof Error) {
        const statusCode = (err as any).statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const message = (err as any).message || 'Something went wrong, please try again later.';

      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: 'JWT Expired',
            statusCode: 401
        });
    }

    if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Token',
            statusCode: 401
        });
    }

      if((err as any).logging) {
        console.error('Error Details:', {
          message: err.message,
          stack: err.stack,
          url: req.url,
          method: req.method,
          timestamp: new Date().toISOString()
        });
    }

        return res.status(statusCode).json({
            success: false,
            message: message,
            statusCode: statusCode
        });
      }
    };
  }
}