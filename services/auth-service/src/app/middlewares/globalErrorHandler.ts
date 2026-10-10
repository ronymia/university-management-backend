/* eslint-disable no-unused-expressions */
import { ErrorRequestHandler, NextFunction } from 'express';
import { IGenericErrorMessage } from '../../interfaces/error';
import config from '../../config';
import handleValidationError from '../../errors/handleValidationError';
import ApiError from '../../errors/ApiError';
import { errorLogger } from '../../shared/logger';
import { ZodError } from 'zod';
import handleZodError from '../../errors/handleZodError';
import handleCastError from '../../errors/handleCastError';

const globalErrorHandler: ErrorRequestHandler = async (
    error,
    req,
    res,
    next: NextFunction,
) => {
    //Debug
    config.env === 'development'
        ? console.log(`🐱‍🏍 globalErrorHandler ~~`, error)
        : errorLogger.error(`🐱‍🏍 globalErrorHandler ~~`, error);

    // defined response properties
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorMessages: IGenericErrorMessage[] = [];

    //validation error message
    if (error?.name === 'ValidationError') {
        const simplifiedError = handleValidationError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessages = simplifiedError?.errorMessages;
    } else if (error instanceof ZodError) {
        const simplifiedError = handleZodError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessages = simplifiedError?.errorMessages;
    } else if (error?.name === 'CastError') {
        const simplifiedError = handleCastError(error);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorMessages = simplifiedError?.errorMessages;
    } else if (error instanceof ApiError) {
        statusCode = error?.statusCode;
        message = error?.message;
        errorMessages = error?.message
            ? [
                  {
                      path: '',
                      message: error?.message,
                  },
              ]
            : [];
    } else if (error instanceof Error) {
        message = error?.message;
        errorMessages = error?.message
            ? [
                  {
                      path: '',
                      message: error?.message,
                  },
              ]
            : [];
    }
    //
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config.env !== 'production' ? error?.stack : undefined,
    });
};

export default globalErrorHandler;
