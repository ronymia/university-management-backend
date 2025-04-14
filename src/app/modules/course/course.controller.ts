import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseServices } from './course.service';

export const createCourse = catchAsync(async (req, res) => {
  const { ...payloadData } = req.body;
  const result = await CourseServices.createCourse(payloadData);

  // SEND RESPONSE
  sendResponse<Course>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully!',
    data: result,
  });
});
export const getAllCourse = () => {};
export const getSingleCourse = () => {};
export const updateCourse = () => {};
export const deleteCourse = () => {};

export const CourseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
