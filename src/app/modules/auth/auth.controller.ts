import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import { ILoginUserResponse, IRefreshTokenResponse } from './auth.interface';
import config from '../../../config';
import httpStatus from 'http-status';

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const { ...loginData } = req.body;

    const result = await AuthService.loginUser(loginData);

    // set refresh token to cookie
    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', result.refreshToken, cookieOptions);

    sendResponse<ILoginUserResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User login successfully !',
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthService.refreshToken(refreshToken);

    // set refresh token to cookie
    const cookieOptions = {
        secure: config.env === 'production',
        httpOnly: true,
    };
    res.cookie('refreshToken', result, cookieOptions);

    sendResponse<IRefreshTokenResponse>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New Refresh token Generated',
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;

    await AuthService.changePassword(user, passwordData);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Password changed successfully !',
    });
});

export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
};
