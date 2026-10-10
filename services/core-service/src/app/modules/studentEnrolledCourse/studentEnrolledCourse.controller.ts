import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentEnrolledCourseService } from './studentEnrolledCourse.service';
import sendResponse from '../../../shared/sendResponse';
import { StudentEnrolledCourse } from '@prisma/client';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { studentEnrolledCourseFilterRequest } from './studentEnrolledCourse.constant';
import { paginationFields } from '../../../constants/pagination';

//  STUDENT ENROLLED COURSE
const getSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentEnrolledCourseService.getSingleStudentEnrolledCourse(id);

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course fetched successfully!',
      data: result,
    });
  }
);

// GET ALL STUDENT ENROLLED COURSE
const getAllStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const filterableFields = pick(
      req.query,
      studentEnrolledCourseFilterRequest
    );
    const pagination = pick(req.query, paginationFields);
    const result =
      await StudentEnrolledCourseService.getAllStudentEnrolledCourse(
        filterableFields,
        pagination
      );

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// UPDATE STUDENT ENROLLED COURSE
const updateStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...payloadData } = req.body;
    const result =
      await StudentEnrolledCourseService.updateStudentEnrolledCourse(
        id,
        payloadData
      );

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course updated successfully!',
      data: result,
    });
  }
);

// DELETE STUDENT ENROLLED COURSE
const deleteStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentEnrolledCourseService.deleteStudentEnrolledCourse(id);

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course deleted successfully!',
      data: result,
    });
  }
);

// EXPORT
export const StudentEnrolledCourseController = {
  getSingleStudentEnrolledCourse,
  getAllStudentEnrolledCourse,
  updateStudentEnrolledCourse,
  deleteStudentEnrolledCourse,
};
