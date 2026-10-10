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

// CREATE BUILD
const createBuilding = async (payload: Building): Promise<Building> => {
  const result = await prisma.$transaction(async tx => {
    const created = await tx.building.create({
      data: payload,
    });

    await tx.outbox.create({
      data: {
        eventType: EVENT_BUILDING_CREATED,
        payload: JSON.stringify(created),
      },
    });

    return created;
  });

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
    include: {
      rooms: true,
    },
  });

  // GET TOTAL COUNT
  const total = await prisma.building.count();
  // GET TOTAL COUNT (based on same filters!)
  const paginationTotal = result?.length;

  const totalPages = Math.ceil(total / limit);

  // RETURN
  return {
    meta: {
      page,
      limit,
      skip,
      total,
      totalPages,
      paginationTotal,
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

  // EXECUTE QUERY WITH OUTBOX
  const result = await prisma.$transaction(async tx => {
    const updated = await tx.building.update({
      where: { id },
      data: payload,
    });

    await tx.outbox.create({
      data: {
        eventType: EVENT_BUILDING_UPDATED,
        payload: JSON.stringify(updated),
      },
    });

    return updated;
  });

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

  // EXECUTE QUERY WITH OUTBOX
  const result = await prisma.$transaction(async tx => {
    const deleted = await tx.building.delete({
      where: { id },
    });

    await tx.outbox.create({
      data: {
        eventType: EVENT_BUILDING_DELETED,
        payload: JSON.stringify(deleted),
      },
    });

    return deleted;
  });

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
