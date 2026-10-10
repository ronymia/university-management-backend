import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.constant';
import { OfferedCourseClassScheduleServices } from './offeredCourseClassSchedule.service';

// CREATE
const createOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body;
    const result =
      await OfferedCourseClassScheduleServices.createOfferedCourseClassSchedule(
        payloadData
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Offered Course Class Schedule created successfully!',
      data: result,
    });
  }
);

// GET ALL
const getAllOfferedCourseClassSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    // GET DATA
    const result =
      await OfferedCourseClassScheduleServices.getAllOfferedCourseClassSchedules(
        filters,
        paginationOptions
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// GET SINGLE
const getSingleOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseClassScheduleServices.getSingleOfferedCourseClassSchedule(
        id
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule fetched successfully!',
      data: result,
    });
  }
);

// UPDATE
const updateOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...payloadData } = req.body;
    const result =
      await OfferedCourseClassScheduleServices.updateOfferedCourseClassSchedule(
        id,
        payloadData
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule updated successfully!',
      data: result,
    });
  }
);

// DELETE
const deleteOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseClassScheduleServices.deleteOfferedCourseClassSchedule(
        id
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule deleted successfully!',
      data: result,
    });
  }
);

// EXPORT
export const OfferedCourseClassScheduleControllers = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getSingleOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule,
};
