import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
import { FacultyService } from './faculty.service';
import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
    }
  }
}

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

// ASSIGNED COURSES
const assignCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ...payloadData } = req.body;
  const result = await FacultyService.assignCourses(id, payloadData.courseIds);

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course assigned to faculty successfully!',
    data: result,
  });
});
// REMOVE ASSIGNED COURSES
const removeCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ...payloadData } = req.body;
  const result = await FacultyService.removeCourses(id, payloadData.courseIds);

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course remove from faculty successfully!',
    data: result,
  });
});

// MY COURSES
const myCourses = catchAsync(async (req, res) => {
  const authUser = (req as any).user;
  const filters = pick(req.query, [
    'academicSemesterId',
    'courseId',
    'facultyId',
  ]);
  const result = await FacultyService.myCourses(authUser, filters);

  // SEND RESPONSE
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully!',
    data: result,
  });
});

const getMyCourseStudents = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const filters = pick(req.query, [
    'academicSemesterId',
    'courseId',
    'offeredCourseSectionId',
  ]);
  const options = pick(req.query, ['limit', 'page']);
  const result = await FacultyService.getMyCourseStudents(
    filters,
    options,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty course students fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});
// EXPORT
export const FacultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
  myCourses,
  getMyCourseStudents,
};
