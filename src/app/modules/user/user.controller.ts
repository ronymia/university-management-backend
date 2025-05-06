import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../../shared/response';

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createStudent(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent
};
