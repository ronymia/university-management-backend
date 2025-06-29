import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import httpStatus from 'http-status';
import config from '../../../config';

// login
const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;

    const result = await AuthService.loginUser(loginData);

    // set refresh token to cookie
    // const cookieOptions = {
    //     secure: config.env === 'production',
    //     httpOnly: true,
    // };
    // res.cookie('refreshToken', result.refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User login successfully !',
        data: result,
    });
});

// refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    // set refresh token to cookie
    // const cookieOptions = {
    //     secure: config.env === 'production',
    //     httpOnly: true,
    // };
    // res.cookie('refreshToken', result, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New Refresh token Generated',
        data: result,
    });
});

// logout
const logout = catchAsync(async (req: Request, res: Response) => {
    // delete refresh token from cookie
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: config.env === 'production',
    });
    // SEND RESPONSE
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Logout successfully !',
    });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;

    await AuthService.changePassword(user, passwordData);

    // SEND RESPONSE
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully !',
    });
});

export const AuthController = {
    logout,
    loginUser,
    refreshToken,
    changePassword,
};
