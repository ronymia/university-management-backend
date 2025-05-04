import { Building, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  buildingSearchableFields,
  EVENT_BUILDING_CREATED,
  EVENT_BUILDING_DELETED,
  EVENT_BUILDING_UPDATED,
} from './building.constant';
import { IBuildingFilters } from './building.interface';
import { RedisClient } from '../../../shared/redis';

// CREATE BUILD
const createBuilding = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: payload,
  });

  if (result) {
    await RedisClient.publish(EVENT_BUILDING_CREATED, JSON.stringify(result));
  }

  // RETURN
  return result;
};

// GET BY ID
const getSingleBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: { id },
  });

  //  RETURN
  return result;
};

// GET ALL
const getAllBuildings = async (
  filters: IBuildingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  // PAGINATION
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filters;

  // QUERY BUILDER
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // field Filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  // BUILD QUERY
  const whereCondition: Prisma.BuildingWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  // EXECUTE QUERY
  const result = await prisma.building.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // GET TOTAL COUNT
  const total = await prisma.building.count();

  // RETURN
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// UPDATE
const updateBuilding = async (
  id: string,
  payload: Partial<Building>
): Promise<Building | null> => {
  // CHECK IF BUILDING EXISTS
  const isExist = await prisma.building.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }

  // EXECUTE QUERY
  const result = await prisma.building.update({
    where: { id },
    data: payload,
  });

  // PUBLISH EVENT ON REDIS
  if (result) {
    await RedisClient.publish(EVENT_BUILDING_UPDATED, JSON.stringify(result));
  }

  // RETURN
  return result;
};

// DELETE
const deleteBuilding = async (id: string): Promise<Building | null> => {
  // CHECK IF BUILDING EXISTS
  const isExist = await prisma.building.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }

  // EXECUTE QUERY
  const result = await prisma.building.delete({
    where: { id },
  });

  // PUBLISH EVENT ON REDIS
  if (result) {
    await RedisClient.publish(EVENT_BUILDING_DELETED, JSON.stringify(result));
  }

  // RETURN
  return result;
};

// EXPORT SERVICES
export const BuildingService = {
  createBuilding,
  getSingleBuilding,
  getAllBuildings,
  updateBuilding,
  deleteBuilding,
};
