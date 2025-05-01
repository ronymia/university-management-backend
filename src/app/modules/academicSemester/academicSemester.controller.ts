import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { academicSemesterFilterRequest } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

// CREATE ACADEMIC SEMESTER
const createAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    // CREATE ACADEMIC SEMESTER
    const result = await AcademicSemesterService.createAcademicSemester(
      payload
    );

    // SEND RESPONSE
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester created successfully',
      data: result,
    });
  }
);

// GET ACADEMIC SEMESTER BY ID
const getSingleAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicSemesterService.getSingleAcademicSemester(id);

    // SEND RESPONSE
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester fetched successfully!',
      data: result,
    });
  }
);

// GET ALL ACADEMIC SEMESTER
const getAllAcademicSemesters = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicSemesterFilterRequest);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicSemesterService.getAllAcademicSemesters(
      filters,
      paginationOptions
    );

    // SEND RESPONSE
    sendResponse<AcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semesters fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// UPDATE ACADEMIC SEMESTER BY ID
const updateAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...payload } = req.body;
    const result = await AcademicSemesterService.updateAcademicSemester(
      id,
      payload
    );

    // SEND RESPONSE
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester updated successfully!',
      data: result,
    });
  }
);

// DELETE ACADEMIC SEMESTER BY ID
const deleteAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AcademicSemesterService.deleteAcademicSemester(id);

    // SEND RESPONSE
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester deleted successfully!',
      data: result,
    });
  }
);

// EXPORT CONTROLLERS
export const AcademicSemesterController = {
  createAcademicSemester,
  getSingleAcademicSemester,
  getAllAcademicSemesters,
  updateAcademicSemester,
  deleteAcademicSemester,
};
