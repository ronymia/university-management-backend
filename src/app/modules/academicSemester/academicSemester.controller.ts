import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { AcademicSemesterServices } from './academicSemester.service';

// CREATE ACADEMIC SEMESTER
const createAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.createAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL ACADEMIC SEMESTER
const getAllAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.getAllAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ACADEMIC SEMESTER
const getSingleAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.getSingleAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE ACADEMIC SEMESTER
const updateAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.updateAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE ACADEMIC SEMESTER
const deleteAcademicSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicSemesterServices.deleteAcademicSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
  deleteAcademicSemester
};
