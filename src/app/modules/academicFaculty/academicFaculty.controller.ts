import { AcademicFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicFacultyFilterableFields } from './academicFaculty.constant';
import { AcademicFacultyService } from './academicFaculty.service';

// create faculty
const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { ...academicFacultyData } = req.body;
    const result = await AcademicFacultyService.createAcademicFaculty(
      academicFacultyData
    );

    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Academic Faculty created successfully!',
      data: result,
    });
  }
);

// get single Faculty
const getSingleAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicFacultyService.getSingleAcademicFaculty(id);

    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty fetched successfully!',
      data: result,
    });
  }
);

// get all Faculty
const getAllAcademicFaculties = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicFacultyFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicFacultyService.getAllAcademicFaculties(
      filters,
      paginationOptions
    );

    sendResponse<AcademicFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Faculty fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// // update single Faculty
// const updateAcademicFaculty = catchAsync(
//     async (req: Request, res: Response) => {
//         const { id } = req.params;
//         const result = await AcademicFacultyService.updateAcademicFaculty(
//             id,
//             req.body,
//         );

//         sendResponse<IAcademicFaculty>(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: 'Academic Faculty updated successfully!',
//             data: result,
//         });
//     },
// );

// // delete single Faculty
// const deleteAcademicFaculty = catchAsync(
//     async (req: Request, res: Response) => {
//         const { id } = req.params;
//         const result = await AcademicFacultyService.deleteAcademicFaculty(id);

//         sendResponse<IAcademicFaculty>(res, {
//             statusCode: httpStatus.OK,
//             success: true,
//             message: 'Academic Faculty Deleted successfully!',
//             data: result,
//         });
//     },
// );

export const AcademicFacultyController = {
  createAcademicFaculty,
  getSingleAcademicFaculty,
  getAllAcademicFaculties,
  // updateAcademicFaculty,
  // deleteAcademicFaculty,
};
