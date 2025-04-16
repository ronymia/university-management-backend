import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  console.log({ handleValidationError: error });
  const statusCode = httpStatus.BAD_REQUEST;
  const message = error.message;

  const errors: IGenericErrorMessage[] = [
    {
      path: '',
      message: error.message,
    },
  ];

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleValidationError;
