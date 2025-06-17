import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  EVENT_OFFERED_COURSE_CLASS_SCHEDULE_CREATED,
  EVENT_OFFERED_COURSE_CLASS_SCHEDULE_DELETED,
  EVENT_OFFERED_COURSE_CLASS_SCHEDULE_UPDATED,
  offeredCourseClassScheduleSearchableFields,
} from './offeredCourseClassSchedule.constant';
import { IOfferedCourseClassScheduleFilter } from './offeredCourseClassSchedule.interface';
import { OfferedCourseClassScheduleUtils } from './offerredCourseClassSchedule.utils';
import { RedisClient } from '../../../shared/redis';

// CREATE
const createOfferedCourseClassSchedule = async (
  payload: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkAvailableRoom(payload);
  await OfferedCourseClassScheduleUtils.checkAvailableFaculty(payload);

  // CREATE
  const result = await prisma.offeredCourseClassSchedule.create({
    data: payload,
    include: {
      room: true,
      faculty: true,
      offeredCourseSection: true,
      semesterRegistration: true,
    },
  });

  // PUBLISH ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_OFFERED_COURSE_CLASS_SCHEDULE_CREATED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// GET ALL
const getAllOfferedCourseClassSchedules = async (
  filters: IOfferedCourseClassScheduleFilter,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  // PAGINATION
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filters;

  // QUERY BUILDER
  const andCondition = [];

  // SEARCH IN FIELD
  if (searchTerm) {
    andCondition.push({
      OR: offeredCourseClassScheduleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // FILTERING
  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        // Convert minCredit/maxCredit to number

        // Keep status/code/startDate/endDate as-is
        return { [field]: value };
      }),
    });
  }

  // QUERY
  const whereCondition: Prisma.OfferedCourseClassScheduleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // EXECUTE QUERY
  const result = await prisma.offeredCourseClassSchedule.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      faculty: true,
      room: true,
      offeredCourseSection: true,
      semesterRegistration: true,
    },
  });

  // TOTAL COUNT
  const total = await prisma.offeredCourseClassSchedule.count({
    where: whereCondition,
  });

  // GET TOTAL COUNT (based on same filters!)
  const paginationTotal = await prisma.offeredCourseClassSchedule.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(total / limit);

  // RETURN
  return {
    data: result,
    meta: {
      page,
      limit,
      skip,
      total,
      totalPages,
      paginationTotal,
    },
  };
};

// GET BY ID
const getSingleOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
    include: {
      faculty: true,
      room: true,
      offeredCourseSection: true,
      semesterRegistration: true,
    },
  });
  return result;
};

// UPDATE
const updateOfferedCourseClassSchedule = async (
  id: string,
  payload: any
): Promise<OfferedCourseClassSchedule> => {
  const isExist = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // UPDATE
  const result = await prisma.offeredCourseClassSchedule.update({
    where: { id },
    data: payload,
    include: {
      faculty: true,
      room: true,
      offeredCourseSection: true,
      semesterRegistration: true,
    },
  });

  // PUBLISH ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_OFFERED_COURSE_CLASS_SCHEDULE_UPDATED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};
// DELETE
const deleteOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule> => {
  const isExist = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // DELETE
  const result = await prisma.offeredCourseClassSchedule.delete({
    where: { id },
    include: {
      faculty: true,
      room: true,
      offeredCourseSection: true,
      semesterRegistration: true,
    },
  });

  // PUBLISH ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_OFFERED_COURSE_CLASS_SCHEDULE_DELETED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// EXPORT
export const OfferedCourseClassScheduleServices = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getSingleOfferedCourseClassSchedule,
  updateOfferedCourseClassSchedule,
  deleteOfferedCourseClassSchedule,
};
