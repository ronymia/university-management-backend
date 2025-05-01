import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { AcademicFacultyServices } from './academicFaculty.service';

// CREATE ACADEMIC FACULTY
const createAcademicFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicFacultyServices.createAcademicFaculty(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL ACADEMIC FACULTY
const getAllAcademicFaculties = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicFacultyServices.getAllAcademicFaculties(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ACADEMIC FACULTY
const getSingleAcademicFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicFacultyServices.getSingleAcademicFaculty(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty
};
