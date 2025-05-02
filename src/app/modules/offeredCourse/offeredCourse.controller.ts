import { NextFunction, Request, Response } from 'express';
import { OfferedCourseServices } from './offeredCourse.service';
import sendResponse from '../../../shared/response';

// CREATE OFFERED COURSE
const createOfferedCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseServices.createOfferedCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL OFFERED COURSE
const getAllOfferedCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseServices.getAllOfferedCourses(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE OFFERED COURSE
const getSingleOfferedCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseServices.getSingleOfferedCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE OFFERED COURSE
const updateOfferedCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseServices.updateOfferedCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE OFFERED COURSE
const deleteOfferedCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseServices.deleteOfferedCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const OfferedCourseControllers = {
  createOfferedCourse,
  getSingleOfferedCourse,
  getAllOfferedCourses,
  updateOfferedCourse,
  deleteOfferedCourse
};
