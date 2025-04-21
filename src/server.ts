/* eslint-disable no-unused-expressions */
import { Server } from 'http';
import app from './app';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { prisma } from './shared/prisma';

async function bootstrap() {
  try {
    // Connect to the database
    await prisma.$connect();
    config.env === 'development'
      ? console.log('🟢 Database connected successfully')
      : logger.info('🟢 Database connected successfully');

    // Start the server only after DB is connected
    const server: Server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
        });
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = (error: unknown) => {
      config.env === 'development'
        ? console.log(error)
        : errorLogger.error(error);
      exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGTERM', () => {
      config.env === 'development'
        ? console.log('SIGTERM received')
        : logger.info('SIGTERM received');
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    config.env === 'development'
      ? console.log(error)
      : errorLogger.error('❌ Failed to connect to the database', error);
    process.exit(1); // Exit the process if DB connection fails
  }
}

bootstrap();
