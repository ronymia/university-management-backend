import { NextFunction, Request, Response } from 'express';
import { StudentEnrolledCourseMarkServices } from './studentEnrolledCourseMark.service';
import sendResponse from '../../../shared/response';

const updateStudentEnrolledCourseMark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentEnrolledCourseMarkServices.updateStudentEnrolledCourseMark(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const updateStudentEnrolledCourseFinalMark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await StudentEnrolledCourseMarkServices.updateStudentEnrolledCourseFinalMark(
      req
    );
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const getAllStudentEnrolledCourseMarks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await StudentEnrolledCourseMarkServices.getAllStudentEnrolledCourseMarks(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const getSingleStudentEnrolledCourseMark = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await StudentEnrolledCourseMarkServices.getSingleStudentEnrolledCourseMark(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

export const StudentEnrolledCourseMarkControllers = {
  updateStudentEnrolledCourseMark,
  updateStudentEnrolledCourseFinalMark,
  getAllStudentEnrolledCourseMarks,
  getSingleStudentEnrolledCourseMark
};
