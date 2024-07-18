import { Building, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { buildingSearchableFields } from './building.constant';
import { IBuildingFilters } from './building.interface';

const createBuilding = (payload: Building): Promise<Building> => {
  const result = prisma.building.create({
    data: payload,
  });

  return result;
};

const getSingleBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({
    where: { id },
  });
  return result;
};

const getAllBuildings = async (
  filters: IBuildingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

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

  const whereCondition: Prisma.BuildingWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.building.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const total = await prisma.building.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateBuilding = async (
  id: string,
  payload: Partial<Building>
): Promise<Building | null> => {
  console.log(payload);
  const isExist = await prisma.building.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }

  // Update the faulty
  const result = await prisma.building.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteBuilding = async (id: string): Promise<Building | null> => {
  const isExist = await prisma.building.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Building not found');
  }

  const result = await prisma.building.delete({
    where: { id },
  });

  return result;
};
export const BuildingService = {
  createBuilding,
  getSingleBuilding,
  getAllBuildings,
  updateBuilding,
  deleteBuilding,
};
