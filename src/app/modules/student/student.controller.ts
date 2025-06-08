import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constant';
import { StudentService } from './student.service';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
    }
  }
}

// get single
const createStudent = catchAsync(async (req: Request, res: Response) => {
  const { ...studentData } = req.body;
  const result = await StudentService.createStudent(studentData);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Created successfully!',
    data: result,
  });
});

// get single
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudent(id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student fetched successfully!',
    data: result,
  });
});

// get all
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions
  );

  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Student fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// update single
const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.updateStudent(id, req.body);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully!',
    data: result,
  });
});

// delete
const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudent(id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student Deleted successfully!',
    data: result,
  });
});

// GET MY COURSES
const myCourses = catchAsync(async (req: Request, res: Response) => {
  const authUserId = req.user?.id;
  const filterRequest = pick(req.query, ['academicSemesterId', 'courseId']);
  const result = await StudentService.myCourses(authUserId, filterRequest);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Courses fetched successfully!',
    data: result,
  });
});

// GET MY SEMESTER REGISTRATION COURSES
const mySemesterRegCourses = catchAsync(async (req: Request, res: Response) => {
  const authUserId = req.user?.id;
  // const filterRequest = pick(req.query, ['academicSemesterId', 'courseId']);
  const result = await StudentService.mySemesterRegCourses(authUserId);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Semester Registration Courses fetched successfully!',
    data: result,
  });
});
// GET MY COURSE SCHEDULES
const myCourseSchedules = catchAsync(async (req: Request, res: Response) => {
  const authUserId = req.user?.id;
  const filterRequest = pick(req.query, ['academicSemesterId', 'courseId']);
  const result = await StudentService.myCourseSchedules(
    authUserId,
    filterRequest
  );

  // SEND RESPONSE
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Course Schedules fetched successfully!',
    data: result,
  });
});
// GET MY ACADEMIC INFO
const myAcademicInfo = catchAsync(async (req: Request, res: Response) => {
  const authUserId = req.user?.id;
  const result = await StudentService.myAcademicInfo(authUserId);

  // SEND RESPONSE
  sendResponse<any>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Academic Information fetched successfully!',
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  myCourses,
  mySemesterRegCourses,
  myCourseSchedules,
  myAcademicInfo,
};
