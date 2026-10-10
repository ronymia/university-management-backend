import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicSemester } from './academicSemester.interface';
import { AcademicSemesterService } from './academicSemester.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constant/pagination';
import { academicSemesterFilterableFields } from './academicSemester.constant';
import httpStatus from 'http-status';

// create semester
const createAcademicSemester = catchAsync(
    async (req: Request, res: Response) => {
        const { ...academicSemesterData } = req.body;
        const result =
            await AcademicSemesterService.createAcademicSemester(
                academicSemesterData,
            );

        sendResponse<IAcademicSemester>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Academic Semester created successfully!',
            data: result,
        });
    },
);

// get single semester
const getSingleAcademicSemester = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result =
            await AcademicSemesterService.getSingleAcademicSemester(id);

        sendResponse<IAcademicSemester>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Semester fetched successfully!',
            data: result,
        });
    },
);

// get all semesters
const getAllAcademicSemesters = catchAsync(
    async (req: Request, res: Response) => {
        const filters = pick(req.query, academicSemesterFilterableFields);
        const paginationOptions = pick(req.query, paginationFields);

        const result = await AcademicSemesterService.getAllAcademicSemesters(
            filters,
            paginationOptions,
        );

        sendResponse<IAcademicSemester[]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Semesters fetched successfully!',
            meta: result.meta,
            data: result.data,
        });
    },
);

// update single semester
const updateAcademicSemester = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await AcademicSemesterService.updateAcademicSemester(
            id,
            req.body,
        );

        sendResponse<IAcademicSemester>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Semester updated successfully!',
            data: result,
        });
    },
);

// delete single semester
const deleteAcademicSemester = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await AcademicSemesterService.deleteAcademicSemester(id);

        sendResponse<IAcademicSemester>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Academic Semester Deleted successfully!',
            data: result,
        });
    },
);

export const AcademicSemesterController = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester,
    deleteAcademicSemester,
};
