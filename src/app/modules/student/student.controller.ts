import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { StudentServices } from './student.service';

// GET ALL STUDENT
const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getAllStudents(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// GET STUDENT BY ID
const getSingleStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getSingleStudent(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// UPDATE STUDENT
const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.updateStudent(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE STUDENT
const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.deleteStudent(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const StudentControllers = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent
};
