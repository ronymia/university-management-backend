import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';
import httpStatus from 'http-status';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
    const errors: IGenericErrorMessage[] = error.issues.map(
        (issue: ZodIssue) => {
            return {
                path: issue?.path[issue.path.length - 1],
                message: issue?.message,
            };
        },
    );

    const statusCode = httpStatus.UNPROCESSABLE_ENTITY;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages: errors,
    };
};

export default handleZodError;
