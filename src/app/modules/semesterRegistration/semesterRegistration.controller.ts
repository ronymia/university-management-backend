import {
  SemesterRegistration,
  StudentSemesterRegistration,
} from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;
    const result = await SemesterRegistrationService.createSemesterRegistration(
      payload
    );

    // SEND RESPONSE
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration created successfully',
      data: result,
    });
  }
);

// GET ALL SEMESTER REGISTRATION
const getAllSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    // GET ALL
    const result = await SemesterRegistrationService.getAllSemesterRegistration(
      filters,
      paginationOptions
    );

    // SEND RESPONSE
    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationService.getSingleSemesterRegistration(id);

    // SEND RESPONSE
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration fetched successfully',
      data: result,
    });
  }
);

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.updateSemesterRegistration(
      id,
      req.body
    );

    // SEND RESPONSE
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration updated successfully',
      data: result,
    });
  }
);

// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SemesterRegistrationService.deleteSemesterRegistration(
      id
    );

    // SEND RESPONSE
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration deleted successfully',
      data: result,
    });
  }
);

// ENROLL INTO SEMESTER REGISTRATION
const enrollIntoSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payload } = req.body;
    const result =
      await SemesterRegistrationService.enrollIntoSemesterRegistration(payload);

    // SEND RESPONSE
    sendResponse<any>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Enrolled Into Semester Registration created successfully',
      data: result,
    });
  }
);

// EXPORT
export const SemesterRegistrationController = {
  createSemesterRegistration,
  getSingleSemesterRegistration,
  getAllSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  enrollIntoSemesterRegistration,
};
