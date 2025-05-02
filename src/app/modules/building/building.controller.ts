import { NextFunction, Request, Response } from 'express';
import sendResponse from '../../../shared/response';
import { BuildingServices } from './building.service';

// CREATE BUILDING
const createBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BuildingServices.createBuilding(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET BUILDING
const getAllBuildings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BuildingServices.getAllBuildings(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE BUILDING
const getSingleBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BuildingServices.getSingleBuilding(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE BUILDING
const updateBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BuildingServices.updateBuilding(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE BUILDING
const deleteBuilding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BuildingServices.deleteBuilding(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const BuildingControllers = {
  createBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateBuilding,
  deleteBuilding
};
