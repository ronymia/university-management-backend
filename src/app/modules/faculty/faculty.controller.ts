import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { FacultyServices } from './faculty.service';

// GET ALL FACULTY
// const getAllFacultiesFromCore = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const result = await FacultyServices.getAllFacultiesFromCore(req);
//     sendResponse(res, result);
//   } catch (error) {
//     next(error);
//   }
// };
// GET ALL FACULTY
const getAllFaculties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyServices.getAllFaculties(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// GET FACULTY BY ID
const getSingleFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyServices.getSingleFaculty(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// UPDATE FACULTY
const updateFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyServices.updateFaculty(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE FACULTY
const deleteFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyServices.deleteFaculty(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL FACULTY
const myCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyServices.myCourses(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// GET ALL FACULTY
const getMyCourseStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await FacultyServices.getMyCourseStudents(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const FacultyControllers = {
  // getAllFacultiesFromCore,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  myCourses,
  getMyCourseStudents
};
