import { NextFunction, Request, Response } from 'express';
import { OfferedCourseSectionServices } from './offeredCourseSection.service';
import sendResponse from '../../../shared/response';

// CREATE OFFERED COURSE SECTION
const createOfferedCourseSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseSectionServices.createOfferedCourseSection(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL OFFERED COURSE SECTION
const getAllOfferedCourseSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseSectionServices.getAllOfferedCourseSections(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE OFFERED COURSE SECTION
const getSingleOfferedCourseSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseSectionServices.getSingleOfferedCourseSection(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE OFFERED COURSE SECTION
const updateOfferedCourseSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseSectionServices.updateOfferedCourseSection(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE OFFERED COURSE SECTION
const deleteOfferedCourseSection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await OfferedCourseSectionServices.deleteOfferedCourseSection(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const OfferedCourseSectionControllers = {
  createOfferedCourseSection,
  getSingleOfferedCourseSection,
  getAllOfferedCourseSections,
  updateOfferedCourseSection,
  deleteOfferedCourseSection
};
