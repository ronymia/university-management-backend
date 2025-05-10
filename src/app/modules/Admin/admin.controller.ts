import { NextFunction, Request, Response } from 'express';
import { AdminServices } from './admin.service';
import sendResponse from '../../../shared/response';

// GET ALL ADMIN
const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminServices.getAllAdmins(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// GET ADMIN BY ID
const getSingleAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminServices.getSingleAdmin(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// UPDATE ADMIN
const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminServices.updateAdmin(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE ADMIN
const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminServices.deleteAdmin(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin
};
