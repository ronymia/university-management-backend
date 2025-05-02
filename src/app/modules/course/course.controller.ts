import { NextFunction, Request, Response } from 'express';
import { CourseServices } from './course.service';
import sendResponse from '../../../shared/response';

// CREATE COURSE
const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.createCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL COURSE
const getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.getAllCourses(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE COURSE
const getSingleCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.getSingleCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE COURSE
const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.updateCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE COURSE
const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.deleteCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// ASSIGN FACULTIES
const assignFaculties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.assignFaculties(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// REMOVE FACULTIES
const removeFaculties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CourseServices.removeFaculties(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties
};
