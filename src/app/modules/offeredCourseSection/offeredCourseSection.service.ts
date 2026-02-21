import { OfferedCourseSection, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  EVENT_OFFERED_COURSE_SECTION_DELETED,
  offeredCourseSectionSearchableFields,
} from './offeredCourseSection.constant';
import {
  IClassSchedule,
  IOfferedCourseSectionCreate,
  IOfferedCourseSectionFilters,
} from './offeredCourseSection.interface';
import { OfferedCourseClassScheduleUtils } from '../offeredCourseClassSchedule/offerredCourseClassSchedule.utils';
import asyncForEach from '../../../shared/asyncForEach';

// CREATE
const createOfferedCourseSection = async (
  payload: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection> => {
  const {
    classSchedules: classSchedulesPayload,
    ...offeredCourseSectionPayload
  } = payload;

  // CHECK IF OFFERED COURSE EXISTS
  const getOfferedCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: offeredCourseSectionPayload.offeredCourseId,
    },
  });

  if (!getOfferedCourse) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Offered course not found with ID ${offeredCourseSectionPayload.offeredCourseId}`
    );
  }

  const getOfferedCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      semesterRegistrationId: getOfferedCourse.semesterRegistrationId,
      title: offeredCourseSectionPayload.title,
    },
  });

  if (getOfferedCourseSection) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Section already exists with ${getOfferedCourseSection.title}`
    );
  }

  await asyncForEach(classSchedulesPayload, async (schedule: any) => {
    await OfferedCourseClassScheduleUtils.checkAvailableRoom(schedule);
    await OfferedCourseClassScheduleUtils.checkAvailableFaculty(schedule);
  });

  const createdSection = await prisma.$transaction(async transactionClient => {
    // CHECK AVAILABLE ROOM AND FACULTY

    // CREATE OFFERED COURSE SECTION
    const createdOfferedCourseSection =
      await transactionClient.offeredCourseSection.create({
        data: {
          ...offeredCourseSectionPayload,
          semesterRegistrationId: getOfferedCourse.semesterRegistrationId,
        },
      });

    // CREATE CLASS SCHEDULES
    const scheduleData = classSchedulesPayload.map(
      (schedule: IClassSchedule) => ({
        ...schedule,
        offeredCourseSectionId: createdOfferedCourseSection.id,
        semesterRegistrationId: getOfferedCourse.semesterRegistrationId,
      })
    );
    await transactionClient.offeredCourseClassSchedule.createMany({
      data: scheduleData,
    });

    return createdOfferedCourseSection;
  });

  // PUBLISH ON REDIS
  // if (createdSection) {
  //   await RedisClient.publish(
  //     EVENT_OFFERED_COURSE_SECTION_CREATED,
  //     JSON.stringify(createdSection)
  //   );
  // }

  // RETURN
  return createdSection;
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
      offeredCourse: {
        include: {
          course: true,
          academicDepartment: true,
        },
      },
      semesterRegistration: {
        include: {
          academicSemester: true,
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // TOTAL COUNT
  const total = await prisma.offeredCourseSection.count({
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
const getSingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: { id },
    include: {
      offeredCourse: true,
      semesterRegistration: true,
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });
  return result;
};

// UPDATE
const updateOfferedCourseSection = async (
  id: string,
  payload: any
): Promise<OfferedCourseSection> => {
  const { classSchedules, ...courseSection } = payload;
  console.log({ classSchedules, courseSection });

  const isExist = await prisma.offeredCourseSection.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  const updateSectionAndSchedules = await prisma.$transaction(
    async transactionClient => {
      // UPDATE COURSE SECTION
      const updatedSection =
        await transactionClient.offeredCourseSection.update({
          where: { id },
          data: courseSection,
        });

      // DELETE CLASS SCHEDULE
      await transactionClient.offeredCourseClassSchedule.deleteMany({
        where: { offeredCourseSectionId: id },
      });

      // UPDATE CLASS SCHEDULE
      await asyncForEach(classSchedules, async (schedule: IClassSchedule) => {
        await transactionClient.offeredCourseClassSchedule.create({
          data: {
            ...schedule,
            offeredCourseSectionId: id,
            semesterRegistrationId: isExist.semesterRegistrationId,
          },
        });
      });

      return updatedSection;
    }
  );

  // PUBLISH ON REDIS
  // if (result) {
  //   await RedisClient.publish(
  //     EVENT_OFFERED_COURSE_SECTION_UPDATED,
  //     JSON.stringify(result)
  //   );
  // }

  // RETURN
  return updateSectionAndSchedules;
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

  // DELETE WITH OUTBOX
  const result = await prisma.$transaction(async tx => {
    const deletedSection = await tx.offeredCourseSection.delete({
      where: { id },
    });

    await tx.outbox.create({
      data: {
        eventType: EVENT_OFFERED_COURSE_SECTION_DELETED,
        payload: JSON.stringify(deletedSection),
      },
    });

    return deletedSection;
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
