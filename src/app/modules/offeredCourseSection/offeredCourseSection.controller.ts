import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseSectionFilterableFields } from './offeredCourseSection.constant';
import { OfferedCourseSectionServices } from './offeredCourseSection.service';

// CREATE
const createOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const { ...payloadData } = req.body;
    const result =
      await OfferedCourseSectionServices.createOfferedCourseSection(
        payloadData
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Offered Course Section created successfully!',
      data: result,
    });
  }
);

// GET ALL
const getAllOfferedCourseSections = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseSectionFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    // GET DATA
    const result =
      await OfferedCourseSectionServices.getAllOfferedCourseSections(
        filters,
        paginationOptions
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course fetched successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

// GET SINGLE
const getSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseSectionServices.getSingleOfferedCourseSection(id);

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course fetched successfully!',
      data: result,
    });
  }
);

// UPDATE
const updateOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ...payloadData } = req.body;
    const result =
      await OfferedCourseSectionServices.updateOfferedCourseSection(
        id,
        payloadData
      );

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course updated successfully!',
      data: result,
    });
  }
);

// DELETE
const deleteOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseSectionServices.deleteOfferedCourseSection(id);

    // SEND RESPONSE
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course deleted successfully!',
      data: result,
    });
  }
);

// EXPORT
export const OfferedCourseSectionControllers = {
  createOfferedCourseSection,
  getAllOfferedCourseSections,
  getSingleOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
