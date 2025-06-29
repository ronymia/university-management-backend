import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import globalExceptionHandler from './app/middlewares/globalExceptionHandler';
import routes from './app/routes';

const app: Application = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://university-management-alfa.vercel.app'],
    credentials: true
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', routes);

app.use(globalExceptionHandler);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found'
      }
    ]
  });
});

export default app;
