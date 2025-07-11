import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { userFilterableFields } from './user.constant';
import { paginationFields } from '../../../constant/pagination';
import { IAdmin } from '../admin/admin.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { IStudent } from '../student/student.interface';

// CREATE STUDENT
const createStudent = catchAsync(async (req: Request, res: Response) => {
    const { student, ...userData } = req.body;
    const result = await UserService.createStudent(student, userData);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Student created successfully!',
        data: result,
    });
});

// CREATE FACULTY
const createFaculty = catchAsync(async (req: Request, res: Response) => {
    const { faculty, ...userData } = req.body;
    // console.log(req.body);
    const result = await UserService.createFaculty(faculty, userData);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Faculty created successfully!',
        data: result,
    });
});

// CREATE ADMIN
const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const { admin, ...userData } = req.body;
    const result = await UserService.createAdmin(admin, userData);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Admin created successfully!',
        data: result,
    });
});

// GET single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.getSingleUser(id);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User fetched successfully!',
        data: result,
    });
});

// get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, userFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await UserService.getAllUsers(filters, paginationOptions);

    sendResponse<IUser[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Users fetched successfully!',
        meta: result.meta,
        data: result.data,
    });
});

// update single user
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.updateUser(id, req.body);

    sendResponse<IUser | IAdmin | IFaculty | IStudent>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User updated successfully!',
        data: result,
    });
});

// delete single user
const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);

    sendResponse<IUser>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Deleted successfully!',
        data: result,
    });
});

export const UserController = {
    createStudent,
    createFaculty,
    createAdmin,
    getSingleUser,
    getAllUsers,
    updateUser,
    deleteUser,
};
