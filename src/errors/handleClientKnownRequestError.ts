import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  console.log({ handleClientKnownRequestError: error });
  const statusCode = httpStatus.BAD_REQUEST;
  const message = error.message;

  const errors: IGenericErrorMessage[] = [
    {
      path: '',
      message,
    },
  ];

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientKnownRequestError;
