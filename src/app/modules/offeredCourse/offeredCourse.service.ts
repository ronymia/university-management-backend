import { OfferedCourse } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import asyncForEach from '../../../shared/asyncForEach';
import { prisma } from '../../../shared/prisma';
import { IOfferedCourse } from './offeredCourse.interface';

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
  await asyncForEach(courseIds, async (courseId: string) => {
    const offeredCourseExists = await prisma.offeredCourse.findFirst({
      where: {
        courseId,
        academicDepartmentId,
        semesterRegistrationId,
      },
    });

    // IF NIT EXIST THEN CREATE NEW
    if (!offeredCourseExists) {
      // CREATE
      const offeredCourse = await prisma.offeredCourse.create({
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

  // CREATE

  // RETURN
  return result;
};

// GET ALL
const getAllOfferedCourses = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  // QUERY
  const result = await prisma.offeredCourse.findMany({
    include: {
      course: true,
      academicDepartment: true,
      semesterRegistration: true,
    },
  });

  // RETURN
  return {
    data: result,
    meta: {
      total: result.length,
      page: 1,
      limit: result.length,
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
  payload: any
): Promise<OfferedCourse> => {
  const isExist = await prisma.offeredCourse.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, `Invalid ID ${id}`);
  }

  // UPDATE
  const result = await prisma.offeredCourse.update({
    where: { id },
    data: payload,
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

  // DELETE
  const result = await prisma.offeredCourse.delete({
    where: { id },
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
