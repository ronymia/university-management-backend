import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentSemesterPaymentService } from './studentSemesterPayment.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { StudentSemesterPayment } from '@prisma/client';
import pick from '../../../shared/pick';
import { studentSemesterPaymentFilterRequest } from './studentSemesterPayment.constant';
import { paginationFields } from '../../../constants/pagination';

// UPDATE SEMESTER PAYMENT
const updatedSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...payloadData } = req.body;
    const result = await StudentSemesterPaymentService.updatedSemesterPayment(
      id,
      payloadData
    );

    // SEND RESPONSE
    // SEND RESPONSE
    sendResponse<StudentSemesterPayment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester Payment updated successfully!',
      data: result,
    });
  }
);

// GET SINGLE STUDENT SEMESTER PAYMENT
const getSingleSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentSemesterPaymentService.getSingleSemesterPayment(
      id
    );

    sendResponse<StudentSemesterPayment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester Payment fetched successfully!',
      data: result,
    });
  }
);

// GET ALL STUDENT SEMESTER PAYMENT
const getAllSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const filterRequest = pick(req.query, studentSemesterPaymentFilterRequest);
    const pagination = pick(req.query, paginationFields);
    const result = await StudentSemesterPaymentService.getAllSemesterPayment(
      filterRequest,
      pagination
    );

    sendResponse<StudentSemesterPayment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester Payments fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// DELETE SEMESTER PAYMENT
const deleteSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await StudentSemesterPaymentService.deleteSemesterPayment(
      id
    );

    // SEND RESPONSE
    sendResponse<StudentSemesterPayment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Semester Payment deleted successfully!',
      data: result,
    });
  }
);

// EXPORT
export const StudentSemesterPaymentController = {
  getSingleSemesterPayment,
  getAllSemesterPayment,
  updatedSemesterPayment,
  deleteSemesterPayment,
};
