import mongoose from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';
import httpStatus from 'http-status';

const handleValidationError = (
    err: mongoose.Error.ValidationError,
): IGenericErrorResponse => {
    const error: IGenericErrorMessage[] = Object.values(err?.errors).map(
        (element: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: element?.path,
                message: element?.message,
            };
        },
    );

    const statusCode = httpStatus.UNPROCESSABLE_ENTITY;

    return {
        statusCode,
        message: 'Validation error',
        errorMessages: error,
    };
};

export default handleValidationError;
