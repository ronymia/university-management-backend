import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentSemesterRegistrationService } from './studentSemesterRegistration.service';
import sendResponse from '../../../shared/sendResponse';
import { StudentSemesterRegistration } from '@prisma/client';
import httpStatus from 'http-status';

// UPDATE SEMESTER Registration
const updatedStudentSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...payloadData } = req.body;
    const result =
      await StudentSemesterRegistrationService.updateStudentSemesterRegistration(
        id,
        payloadData
      );

    // SEND RESPONSE
    sendResponse<StudentSemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester Registration updated successfully!',
      data: result,
    });
  }
);

// DELETE SEMESTER Registration
const deleteStudentSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await StudentSemesterRegistrationService.deleteStudentSemesterRegistration(
        id
      );

    // SEND RESPONSE
    sendResponse<StudentSemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester Registration deleted successfully!',
      data: result,
    });
  }
);

// EXPORT
export const StudentSemesterRegistrationController = {
  updatedStudentSemesterRegistration,
  deleteStudentSemesterRegistration,
};
