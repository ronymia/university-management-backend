import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import httpStatus from 'http-status';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (
    error: mongoose.Error.CastError,
): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = [
        {
            path: error.path,
            message: `Invalid id - ${error.value}`,
        },
    ];

    return {
        statusCode: httpStatus.NOT_ACCEPTABLE,
        message: 'Cast Error',
        errorMessages: errors,
    };
};

export default handleCastError;
