import { NextFunction, Request, Response } from 'express';
import { AuthServices } from './auth.service';
import sendResponse from '../../../shared/response';
import config from '../../../config';
import httpStatus from 'http-status';

// LOGIN USER
const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.loginUser(req);
    // console.log({ result });
    const { refreshToken, ...rest } = result.data;
    // set refresh token to cookie
    const cookieOptions = {
      secure: config.env === 'production',
      httpOnly: true
    };
    res.cookie('refreshToken', refreshToken, cookieOptions);

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User login successfully !',
      data: rest
    });
  } catch (error) {
    next(error);
  }
};

// GET REFRESH TOKEN
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.refreshToken(req);
    // const { refreshToken, ...rest } = result.data;
    // console.log({ result, rest });
    // set refresh token to cookie
    // const cookieOptions = {
    //   secure: config.env === 'production',
    //   httpOnly: true
    // };
    // res.cookie('refreshToken', refreshToken, cookieOptions);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get Refresh token successfully !',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};
// GET REFRESH TOKEN
const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.logout(req);
    // delete refresh token from cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.env === 'production'
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logout success',
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// CHANGE PASSWORD
const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthServices.changePassword(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const AuthControllers = {
  logout,
  loginUser,
  refreshToken,
  changePassword
};
