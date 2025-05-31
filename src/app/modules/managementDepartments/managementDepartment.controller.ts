import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { ManagementDepartmentServices } from './managementDepartment.service';

// CREATE ROOM
const createManagementDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ManagementDepartmentServices.createManagementDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL Management Department
const getAllManagementDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ManagementDepartmentServices.getAllManagementDepartments(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE Management Department
const getSingleManagementDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ManagementDepartmentServices.getSingleManagementDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE Management Department
const updateManagementDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ManagementDepartmentServices.updateManagementDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE Management Department
const deleteManagementDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ManagementDepartmentServices.deleteManagementDepartment(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const ManagementDepartmentControllers = {
  createManagementDepartment,
  getAllManagementDepartments,
  getSingleManagementDepartment,
  updateManagementDepartment,
  deleteManagementDepartment
};
