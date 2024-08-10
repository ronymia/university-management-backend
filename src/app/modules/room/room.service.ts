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

  return result;
};

const getSingleRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

const getAllRooms = async (
  filters: IRoomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

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

  const whereCondition: Prisma.RoomWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

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

  const total = await prisma.room.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateRoom = async (
  id: string,
  payload: Partial<Room>
): Promise<Room | null> => {
  console.log(payload);
  const isExist = await prisma.room.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Update the room
  const result = await prisma.room.update({
    where: { id },
    data: payload,
    include: {
      building: true,
    },
  });

  return result;
};

const deleteRoom = async (id: string): Promise<Room | null> => {
  const isExist = await prisma.room.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  const result = await prisma.room.delete({
    where: { id },
    include: {
      building: true,
    },
  });

  return result;
};
export const RoomService = {
  createRoom,
  getSingleRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
