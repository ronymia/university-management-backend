import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../../shared/response';

// CREATE STUDENT
const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createStudent(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// CREATE ADMIN
const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createAdmin(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// CREATE FACULTY
const createFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createFaculty(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
  createAdmin,
  createFaculty
};
