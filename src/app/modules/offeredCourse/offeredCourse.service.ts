import { OfferedCourse, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import asyncForEach from '../../../shared/asyncForEach';
import { prisma } from '../../../shared/prisma';
import {
  EVENT_OFFERED_COURSE_CREATED,
  EVENT_OFFERED_COURSE_DELETED,
  EVENT_OFFERED_COURSE_UPDATED,
  offeredCourseSearchableFields,
} from './offeredCourse.constant';
import {
  IOfferedCourse,
  IOfferedCourseFilters,
} from './offeredCourse.interface';

// CREATE
const createOfferedCourse = async (
  payload: IOfferedCourse
): Promise<OfferedCourse[]> => {
  const { courseIds, academicDepartmentId, semesterRegistrationId } = payload;

  //   const createMany = await prisma.offeredCourse.createMany({
  //     data: courseIds.map(courseId => ({
  //       academicDepartmentId,
  //       semesterRegistrationId,
  //       courseId,
  //     })),
  //     skipDuplicates: true,
  //   });

  const result: OfferedCourse[] = [];

  await prisma.$transaction(async tx => {
    await asyncForEach(courseIds, async (courseId: string) => {
      const offeredCourseExists = await tx.offeredCourse.findFirst({
        where: {
          courseId,
          academicDepartmentId,
          semesterRegistrationId,
        },
      });

      // IF NIT EXIST THEN CREATE NEW
      if (!offeredCourseExists) {
        // CREATE
        const offeredCourse = await tx.offeredCourse.create({
          data: {
            courseId,
            academicDepartmentId,
            semesterRegistrationId,
          },
          include: {
            course: true,
            academicDepartment: true,
            semesterRegistration: true,
          },
        });
        // PUSH
        result.push(offeredCourse);
      }
    });

    if (result.length) {
      await tx.outbox.create({
        data: {
          eventType: EVENT_OFFERED_COURSE_CREATED,
          payload: JSON.stringify(result),
        },
      });
    }
  });

  // RETURN
  return result;
};

// GET ALL
const getAllOfferedCourses = async (
  filters: IOfferedCourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
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
      OR: offeredCourseSearchableFields.map(field => ({
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
  const whereCondition: Prisma.OfferedCourseWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // EXECUTE QUERY
  const result = await prisma.offeredCourse.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      course: true,
      academicDepartment: true,
      semesterRegistration: true,
    },
  });

  // TOTAL COUNT
  const total = await prisma.offeredCourse.count({
    where: whereCondition,
  });
  // GET TOTAL COUNT (based on same filters!)
  const paginationTotal = result?.length;

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
const getSingleOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: { id },
    include: {
      course: true,
      academicDepartment: true,
      semesterRegistration: true,
    },
  });
  return result;
};

// UPDATE
const updateOfferedCourse = async (
  id: string,
  payload: {
    semesterRegistrationId: string;
    academicDepartmentId: string;
    courseId: string;
  }
): Promise<OfferedCourse> => {
  const isExist = await prisma.offeredCourse.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // UPDATE WITH OUTBOX
  const result = await prisma.$transaction(async tx => {
    const updated = await tx.offeredCourse.update({
      where: { id },
      data: payload,
    });

    await tx.outbox.create({
      data: {
        eventType: EVENT_OFFERED_COURSE_UPDATED,
        payload: JSON.stringify(updated),
      },
    });

    return updated;
  });

  // RETURN
  return result;
};

// DELETE
const deleteOfferedCourse = async (id: string): Promise<OfferedCourse> => {
  const isExist = await prisma.offeredCourse.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // DELETE WITH OUTBOX
  const result = await prisma.$transaction(async tx => {
    const deleted = await tx.offeredCourse.delete({
      where: { id },
    });

    await tx.outbox.create({
      data: {
        eventType: EVENT_OFFERED_COURSE_DELETED,
        payload: JSON.stringify(deleted),
      },
    });

    return deleted;
  });

  // RETURN
  return result;
};

// EXPORT
export const OfferedCourseService = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
