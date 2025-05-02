import { NextFunction, Request, Response } from 'express';
import { StudentEnrolledCourseServices } from './studentEnrolledCourse.service';
import sendResponse from '../../../shared/response';

// CREATE STUDENT ENROLLED COURSE
const createStudentEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentEnrolledCourseServices.createStudentEnrolledCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL STUDENT ENROLLED COURSE
const getAllStudentEnrolledCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentEnrolledCourseServices.getAllStudentEnrolledCourses(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE STUDENT ENROLLED COURSE
const getSingleStudentEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentEnrolledCourseServices.getSingleStudentEnrolledCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE STUDENT ENROLLED COURSE
const updateStudentEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentEnrolledCourseServices.updateStudentEnrolledCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE STUDENT ENROLLED COURSE
const deleteStudentEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentEnrolledCourseServices.deleteStudentEnrolledCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const StudentEnrolledCourseControllers = {
  createStudentEnrolledCourse,
  getAllStudentEnrolledCourse,
  getSingleStudentEnrolledCourse,
  updateStudentEnrolledCourse,
  deleteStudentEnrolledCourse
};
