import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { IManagementDepartment } from './managementDepartment.interface';
import { managementDepartmentFilterableFields } from './managementDepartment.constant';
import { ManagementDepartmentService } from './managementDepartment.service';
import httpStatus from 'http-status';

// create
const createManagementDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { ...academicDepartmentData } = req.body;
        const result =
            await ManagementDepartmentService.createManagementDepartment(
                academicDepartmentData,
            );

        sendResponse<IManagementDepartment>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Management Department created successfully!',
            data: result,
        });
    },
);

// get single
const getSingleManagementDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await ManagementDepartmentService.getSingleManagementDepartment(id);

        sendResponse<IManagementDepartment>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Management Department fetched successfully!',
            data: result,
        });
    },
);

// get all
const getAllManagementDepartments = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, managementDepartmentFilterableFields);
        const paginationOptions = pick(req.query, paginationFields);

        const result =
            await ManagementDepartmentService.getAllManagementDepartments(
                filters,
                paginationOptions,
            );

        sendResponse<IManagementDepartment[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Management Department fetched successfully!',
            meta: result.meta,
            data: result.data,
        });
    },
);

// update
const updateManagementDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await ManagementDepartmentService.updateManagementDepartment(
                id,
                req.body,
            );

        sendResponse<IManagementDepartment>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Management Department updated successfully!',
            data: result,
        });
    },
);

// delete
const deleteManagementDepartment = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await ManagementDepartmentService.deleteManagementDepartment(id);

        sendResponse<IManagementDepartment>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Management Department Deleted successfully!',
            data: result,
        });
    },
);

export const ManagementDepartmentController = {
    createManagementDepartment,
    getSingleManagementDepartment,
    getAllManagementDepartments,
    updateManagementDepartment,
    deleteManagementDepartment,
};
