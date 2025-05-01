import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.createAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};
const getAllAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.getAllAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};
const getSingleAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.getSingleAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester
};
