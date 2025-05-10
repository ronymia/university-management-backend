import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { AcademicDepartmentServices } from './academicDepartment.service';

// CREATE ACADEMIC DEPARTMENT
const createAcademicDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicDepartmentServices.createAcademicDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ACADEMIC DEPARTMENT
const getSingleAcademicDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicDepartmentServices.getSingleAcademicDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL ACADEMIC DEPARTMENT
const getAllAcademicDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicDepartmentServices.getAllAcademicDepartments(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE ACADEMIC DEPARTMENT
const updateAcademicDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicDepartmentServices.updateAcademicDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE ACADEMIC DEPARTMENT
const deleteAcademicDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AcademicDepartmentServices.deleteAcademicDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment
};
