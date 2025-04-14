import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CourseServices } from './course.service';

// CREATE
const createCourse = catchAsync(async (req, res) => {
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
const getAllCourse = catchAsync(async (req, res) => {
  const filters = pick(req.query, ['searchTerm', 'id', 'code', 'name']);
  const paginationOptions = pick(req.query, ['limit', 'page']);
  // GET DATA
  const result = await CourseServices.getAllCourse(filters, paginationOptions);

  // SEND RESPONSE
  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully!',
    data: result,
  });
});

// GET BY ID
const getCourseById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getCourseById(id);

  // SEND RESPONSE
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully!',
    data: result,
  });
});
const updateCourse = () => {};

// DELETE
const deleteCourse = catchAsync(async (req, res) => {
  const { ids } = req.params;
  console.log({ ids: ids.split(',') });
  const result = await CourseServices.deleteCourse(ids.split(','));

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully!',
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};
