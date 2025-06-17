import { Prisma, Room } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  EVENT_ROOM_CREATED,
  EVENT_ROOM_DELETED,
  EVENT_ROOM_UPDATED,
  roomSearchableFields,
} from './room.constant';
import { IRoomFilters } from './room.interface';
import { RedisClient } from '../../../shared/redis';

const createRoom = (payload: Room): Promise<Room> => {
  const result = prisma.room.create({
    data: payload,
    include: {
      building: true,
    },
  });

  // PUBLISH ON REDIS
  if (result) {
    RedisClient.publish(EVENT_ROOM_CREATED, JSON.stringify(result));
  }

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

  // console.log({ filtersData });

  // field Filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        // FILTERING
        if (field === 'buildingId') {
          return {
            building: {
              id: {
                equals: value,
              },
            },
          };
        }

        // FILTERING
        if (Array.isArray(value)) {
          return {
            [field]: {
              in: value,
            },
          };
        }

        // DEFAULT
        return {
          [field]: {
            equals: value,
          },
        };
      }),
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

  // PUBLISH EVENT ON REDIS
  if (result) {
    RedisClient.publish(EVENT_ROOM_UPDATED, JSON.stringify(result));
  }

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

  // PUBLISH EVENT ON REDIS
  if (result) {
    RedisClient.publish(EVENT_ROOM_DELETED, JSON.stringify(result));
  }

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
