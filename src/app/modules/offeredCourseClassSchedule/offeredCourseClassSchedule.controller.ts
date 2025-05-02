import { NextFunction, Request, Response } from 'express';
import { OfferedCourseClassScheduleServices } from './offeredCourseClassSchedule.service';
import sendResponse from '../../../shared/response';

// CREATE OFFERED COURSE CLASS SCHEDULE
const createOfferedCourseClassSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OfferedCourseClassScheduleServices.createOfferedCourseClassSchedule(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL OFFERED COURSE CLASS SCHEDULE
const getAllOfferedCourseClassSchedules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OfferedCourseClassScheduleServices.getAllOfferedCourseClassSchedules(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE OFFERED COURSE CLASS SCHEDULE
const getSingleOfferedCourseClassSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OfferedCourseClassScheduleServices.getSingleOfferedCourseClassSchedule(
      req
    );
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE OFFERED COURSE CLASS SCHEDULE
const updateOfferedCourseClassSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OfferedCourseClassScheduleServices.updateOfferedCourseClassSchedule(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE OFFERED COURSE CLASS SCHEDULE
const deleteOfferedCourseClassSchedule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await OfferedCourseClassScheduleServices.deleteOfferedCourseClassSchedule(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const OfferedCourseClassScheduleControllers = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getSingleOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule
};
