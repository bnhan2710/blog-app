import { ErrorRequestHandler } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    console.error(err);
    return res.status(statusCode).json({
        message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    });
};