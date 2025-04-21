import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  console.log({ handleValidationError: error.message });
  const statusCode = httpStatus.BAD_REQUEST;
  // const message = error.message;
  const message = error.message.trim().split('\n');

  const errors: IGenericErrorMessage[] = [
    {
      path: '',
      message: message[message.length - 1],
    },
  ];

  return {
    statusCode,
    message: message[message.length - 1],
    errorMessages: errors,
  };
};

export default handleValidationError;
