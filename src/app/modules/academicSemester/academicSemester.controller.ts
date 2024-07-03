import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;

    const result = await AcademicSemesterService.createAcademicSemester(
      payload
    );

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester created successfully',
      data: result,
    });
  }
);

export const AcademicSemesterController = {
  createAcademicSemester,
};
