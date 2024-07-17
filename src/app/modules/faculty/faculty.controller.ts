import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { FacultyService } from './faculty.service';

// CREATE FACULTY
const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const { ...facultyData } = req.body;

  const result = await FacultyService.createFaculty(facultyData);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Faculty Created successfully!',
    data: result,
  });
});

// SINGLE FACULTY
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.getSingleFaculty(id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty fetched successfully!',
    data: result,
  });
});

// ALL FACULTY
const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await FacultyService.getAllFaculties(
    filters,
    paginationOptions
  );

  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Faculty fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// UPDATE FACULTY
const updateFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.updateFaculty(id, req.body);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully!',
    data: result,
  });
});

// DELETE FACULTY
const deleteFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.deleteFaculty(id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Deleted successfully!',
    data: result,
  });
});

export const FacultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
