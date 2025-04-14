import { Prisma, Room } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { roomSearchableFields } from './room.constant';
import { IRoomFilters } from './room.interface';

const createRoom = (payload: Room): Promise<Room> => {
  const result = prisma.room.create({
    data: payload,
    include: {
      building: true,
    },
  });

  // RETURN
  return result;
};

const getSingleRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });
  // RETURN
  return result;
};

// GET ALL
const getAllRooms = async (
  filters: IRoomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  // FILTER
  const { searchTerm, ...filtersData } = filters;

  // PAGINATION
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // QUERY BUILDER
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: roomSearchableFields.map(field => ({
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
  const whereCondition: Prisma.RoomWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  // EXECUTE QUERY
  const result = await prisma.room.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      building: true,
    },
  });

  // GET TOTAL COUNT
  const total = await prisma.room.count();

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
const updateRoom = async (
  id: string,
  payload: Partial<Room>
): Promise<Room | null> => {
  // CHECK IF ROOM EXISTS
  const isExist = await prisma.room.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // EXECUTE QUERY
  const result = await prisma.room.update({
    where: { id },
    data: payload,
    include: {
      building: true,
    },
  });

  // RETURN
  return result;
};

// DELETE
const deleteRoom = async (id: string): Promise<Room | null> => {
  // CHECK IF ROOM EXISTS
  const isExist = await prisma.room.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // EXECUTE QUERY
  const result = await prisma.room.delete({
    where: { id },
    include: {
      building: true,
    },
  });

  // RETURN
  return result;
};

// EXPORT
export const RoomService = {
  createRoom,
  getSingleRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
