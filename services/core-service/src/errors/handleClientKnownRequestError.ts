import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { IGenericErrorMessage } from '../interfaces/error';

const handleClientKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError
) => {
  // console.log({
  //   handleClientKnownRequestError: error.meta,
  // });
  const statusCode = httpStatus.UNPROCESSABLE_ENTITY;
  const messages = error.message.trim().split('\n');
  const message = messages[messages.length - 1];
  const match = message.match(/\(`(.*?)`\)/);

  const field = match ? match[1] : null;

  const errors: IGenericErrorMessage[] = [
    {
      path: field || '',
      message: 'A record with the same value already exists.',
    },
  ];

  return {
    statusCode,
    message: messages[message.length - 1],
    errorMessages: errors,
  };
};

export default handleClientKnownRequestError;
