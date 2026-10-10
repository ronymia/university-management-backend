import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../../errors/apiError';
import { JwtHelper } from '../../helpers/jwtHelper';

const auth =
  () =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publicRoutes = ['/api/v1/auth/login', '/api/v1/auth/refresh-token'];

      if (publicRoutes.includes(req.originalUrl)) {
        return next();
      }

      // get authorization token
      let token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized! Token is missing.');
      }
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }

      // verify token
      let verifiedUser = null;
      try {
        verifiedUser = JwtHelper.verifyToken(token);
      } catch (error) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
      }

      // attach user details to request for down-river services if needed
      (req as any).user = verifiedUser;

      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;
