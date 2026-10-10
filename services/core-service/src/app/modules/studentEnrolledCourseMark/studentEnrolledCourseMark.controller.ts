import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';
import { StudentEnrolledCourseMark } from '@prisma/client';

// UPDATE STUDENT ENROLLED COURSE MARK
const updateStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body;
    const result =
      await StudentEnrolledCourseMarkService.updateStudentEnrolledCourseMark(
        payloadData
      );

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course Mark updated successfully!',
      data: result,
    });
  }
);
// UPDATE STUDENT ENROLLED COURSE MARK
const updateStudentFinalMark = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body;
    const result =
      await StudentEnrolledCourseMarkService.updateStudentFinalMark(
        payloadData
      );

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course Mark updated successfully!',
      data: result,
    });
  }
);

// GET STUDENT ENROLLED COURSE MARK
const getSingleStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentEnrolledCourseMarkService.getSingleStudentEnrolledCourseMark(
        id
      );

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourseMark>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course Mark fetched successfully!',
      data: result,
    });
  }
);

// GET ALL STUDENT ENROLLED COURSE MARK
const getAllStudentEnrolledCourseMark = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.getAllStudentEnrolledCourseMark();

    // SEND RESPONSE
    sendResponse<StudentEnrolledCourseMark[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course Mark fetched successfully!',
      data: result,
    });
  }
);

export const StudentEnrolledCourseMarkController = {
  updateStudentFinalMark,
  updateStudentEnrolledCourseMark,
  getSingleStudentEnrolledCourseMark,
  getAllStudentEnrolledCourseMark,
};
