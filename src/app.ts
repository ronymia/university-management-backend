import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { Routes } from './app/routes/index';
import httpStatus from 'http-status';
const app: Application = express();

// using cors
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://university-management-alfa.vercel.app',
        ],
        credentials: true,
    }),
);

//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes
app.use('/api/v1/', Routes);

//Testing
// app.get('/', async (req: Request, res: Response) => {
//     Promise.reject(new Error('unhandled request'));
// });

//global error handler
app.use(globalErrorHandler);

// handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Route not found',
        errorMessages: [{ path: req.originalUrl, message: 'Api not found' }],
        stack: undefined,
    });
    next();
});

export default app;
