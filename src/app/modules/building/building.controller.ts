import { Building } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { buildingFilterableFields } from './building.constant';
import { BuildingService } from './building.service';

//CREATE
const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const { ...buildingData } = req.body;
  const result = await BuildingService.createBuilding(buildingData);

  sendResponse<Building>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Building created successfully!',
    data: result,
  });
});

// get single
const getSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BuildingService.getSingleBuilding(id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building fetched successfully!',
    data: result,
  });
});

// get all
const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await BuildingService.getAllBuildings(
    filters,
    paginationOptions
  );

  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

// update single
const updateBuilding = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BuildingService.updateBuilding(id, req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building updated successfully!',
    data: result,
  });
});

// delete
const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BuildingService.deleteBuilding(id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty Deleted successfully!',
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getSingleBuilding,
  getAllBuildings,
  updateBuilding,
  deleteBuilding,
};
