import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';
import httpStatus from 'http-status';

const auth =
    (...requiredRoles: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // check token
            const token = req.headers.authorization?.split(' ')[1];
            // if token is not provided
            if (!token) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    'You are not Authorized to access this',
                );
            }

            // verify token
            let verifiedUser = null;

            verifiedUser = jwtHelpers.verifyToken(
                token,
                config.jwt.secret as Secret,
            );
            // push verified user into request
            req.user = verifiedUser; // userId , role

            // check role
            if (
                requiredRoles.length &&
                !requiredRoles.includes(verifiedUser.role)
            ) {
                throw new ApiError(
                    httpStatus.FORBIDDEN,
                    'You are not allowed to access this',
                );
            }

            // call next method
            next();
        } catch (error) {
            next(error);
        }
    };

export default auth;
