import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { Routes } from './app/routes/index';
import httpStatus from 'http-status';
const app: Application = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // Draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply the rate limiting middleware to all API requests.
app.use('/api/v1', limiter);

// using cors
app.use(
    cors({
        origin: ['https://university-management-alfa.vercel.app'],
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
