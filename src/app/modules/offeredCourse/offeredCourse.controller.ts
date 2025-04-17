import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseService } from './offeredCourse.service';

// CREATE
const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { ...payloadData } = req.body;
  const result = await OfferedCourseService.createOfferedCourse(payloadData);

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Offered Course created successfully!',
    data: result,
  });
});

// GET ALL
const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    'searchTerm',
    'id',
    'courseId',
    'semesterRegistrationId',
  ]);
  const paginationOptions = pick(req.query, ['limit', 'page']);
  // GET DATA
  const result = await OfferedCourseService.getAllOfferedCourses(
    filters,
    paginationOptions
  );

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// GET SINGLE
const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseService.getSingleOfferedCourse(id);

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course fetched successfully!',
      data: result,
    });
  }
);

// UPDATE
const updateOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ...payloadData } = req.body;
  const result = await OfferedCourseService.updateOfferedCourse(
    id,
    payloadData
  );

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course updated successfully!',
    data: result,
  });
});

// DELETE
const deleteOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseService.deleteOfferedCourse(id);

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course deleted successfully!',
    data: result,
  });
});

// EXPORT
export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
