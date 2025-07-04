import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../../shared/response';

// CREATE STUDENT
const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createStudent(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// CREATE ADMIN
const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createAdmin(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

// CREATE FACULTY
const createFaculty = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.createFaculty(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// GET ALL USERS
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.getAllUsers(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// GET SINGLE USER
const getSingleUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.getSingleUser(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// UPDATE USER
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.updateUser(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};
// DELETE USER
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await UserServices.updateUser(req);
    sendResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createStudent,
  createAdmin,
  createFaculty,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
