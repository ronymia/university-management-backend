import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  console.log({
    handleClientKnownRequestError: error.meta,
  });
  const statusCode = httpStatus.BAD_REQUEST;
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

export default handleClientKnownRequestError;
