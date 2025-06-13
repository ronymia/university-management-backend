import { ENUM_USER_ROLE } from '../../../enums/user';
import { IAdmin } from '../admin/admin.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IStudent } from '../student/student.interface';

export type ILoginUser = {
    id: string;
    password: string;
};

export type ILoginUserResponse = {
    accessToken: string;
    refreshToken?: string;
    needsChangePassword?: boolean;
    user: IStudent | IAdmin | IFaculty;
};

export type IRefreshTokenResponse = {
    accessToken: string;
};

export type IVerifiedLoginUser = {
    userId: string;
    role: ENUM_USER_ROLE;
};

export type IChangePassword = {
    oldPassword: string;
    newPassword: string;
};
