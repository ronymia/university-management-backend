import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { offeredCourseSectionSearchableFields } from './offeredCourseSection.constant';
import { IOfferedCourseSectionFilters } from './offeredCourseSection.interface';

// CREATE
const createOfferedCourseSection = async (
  payload: OfferedCourseSection
): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.create({
    data: payload,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  // RETURN
  return result;
};

// GET ALL
const getAllOfferedCourseSections = async (
  filters: IOfferedCourseSectionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
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
      OR: offeredCourseSectionSearchableFields.map(field => ({
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
  const whereCondition: Prisma.OfferedCourseSectionWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // EXECUTE QUERY
  const result = await prisma.offeredCourseSection.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });

  // TOTAL COUNT
  const total = await prisma.offeredCourseSection.count({
    where: whereCondition,
  });

  // RETURN
  return {
    data: result,
    meta: {
      total,
      page,
      limit,
    },
  };
};

// GET BY ID
const getSingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: { id },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
    },
  });
  return result;
};

// UPDATE
const updateOfferedCourseSection = async (
  id: string,
  payload: any
): Promise<OfferedCourseSection> => {
  const isExist = await prisma.offeredCourseSection.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // UPDATE
  const result = await prisma.offeredCourseSection.update({
    where: { id },
    data: payload,
  });

  // RETURN
  return result;
};
// DELETE
const deleteOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection> => {
  const isExist = await prisma.offeredCourseSection.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // DELETE
  const result = await prisma.offeredCourseSection.delete({
    where: { id },
  });

  // RETURN
  return result;
};

// EXPORT
export const OfferedCourseSectionServices = {
  createOfferedCourseSection,
  getAllOfferedCourseSections,
  getSingleOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
