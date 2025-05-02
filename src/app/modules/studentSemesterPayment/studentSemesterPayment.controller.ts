import { NextFunction, Request, Response } from 'express';
import { StudentSemesterPaymentServices } from './studentSemesterPayment.service';
import sendResponse from '../../../shared/response';

const updateSemesterPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentSemesterPaymentServices.updateSemesterPayment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const getAllStudentSemesterPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentSemesterPaymentServices.getAllStudentSemesterPayments(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const getSingleStudentSemesterPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentSemesterPaymentServices.getSingleStudentSemesterPayment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const deleteStudentSemesterPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentSemesterPaymentServices.deleteStudentSemesterPayment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const StudentSemesterPaymentControllers = {
  updateSemesterPayment,
  getAllStudentSemesterPayments,
  getSingleStudentSemesterPayment,
  deleteStudentSemesterPayment
};
