/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, {
    JsonWebTokenError,
    JwtPayload,
    Secret,
    TokenExpiredError,
} from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

const createToken = (
    payload: object,
    secret: Secret,
    expiresTime: string,
): string => {
    return jwt.sign(payload, secret as Secret, {
        expiresIn: expiresTime,
    });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new ApiError(
                httpStatus.UNAUTHORIZED,
                'Your token has expired',
            );
        } else if (error instanceof JsonWebTokenError) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid JWT token');
        } else {
            throw new ApiError(
                httpStatus.UNAUTHORIZED,
                'Token verification failed',
            );
        }
    }
};

export const jwtHelpers = {
    createToken,
    verifyToken,
};
