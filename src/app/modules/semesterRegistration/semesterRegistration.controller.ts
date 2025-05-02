import { NextFunction, Request, Response } from 'express';
import { SemesterRegistrationServices } from './semesterRegistration.service';
import sendResponse from '../../../shared/response';

// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.createSemesterRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL SEMESTER REGISTRATION
const getAllSemesterRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.getAllSemesterRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.getSingleSemesterRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.updateSemesterRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.deleteSemesterRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const enrollIntoSemesterRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.enrollIntoSemesterRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const enrolledIntoCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.enrolledIntoCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const withdrawFromEnrolledCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.withdrawFromEnrolledCourse(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const confirmMyRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.confirmMyRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const getMyRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.getMyRegistration(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

const startNewSemester = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await SemesterRegistrationServices.startNewSemester(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  enrollIntoSemesterRegistration,
  enrolledIntoCourse,
  withdrawFromEnrolledCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester
};
