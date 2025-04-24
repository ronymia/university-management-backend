import { Prisma, StudentEnrolledCourse } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IStudentEnrolledCourseFilterRequest } from './studentEnrolledCourse.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { studentEnrolledCourseSearchableFields } from './studentEnrolledCourse.constant';
import { IGenericResponse } from '../../../interfaces/common';

const createStudentEnrolledCourse = async (payload: any): Promise<any> => {
  // CHECK IF THE STUDENT ENROLLED COURSE EXISTS
  const isExist = await prisma.studentEnrolledCourse.findUnique({
    where: { id: payload.id },
  });
  if (isExist) {
    throw new Error('Student enrolled course already exists');
  }

  // CREATE
  const createdStudentEnrolledCourse =
    await prisma.studentEnrolledCourse.create({
      data: payload,
    });
  if (!createdStudentEnrolledCourse) {
    throw new Error('Failed to create student enrolled course');
  }

  // RETURN TO THE CONTROLLER
  return createdStudentEnrolledCourse;
};

// GET SINGLE STUDENT ENROLLED COURSE
const getSingleStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse> => {
  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findUnique({
    where: { id },
  });
  if (!studentEnrolledCourse) {
    throw new Error('Student enrolled course not found');
  }

  // RETURN TO THE CONTROLLER
  return studentEnrolledCourse;
};

// GET ALL STUDENT ENROLLED COURSE
const getAllStudentEnrolledCourse = async (
  filterRequest: IStudentEnrolledCourseFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourse[]>> => {
  // PAGINATION
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filterRequest;

  // QUERY BUILDER
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: studentEnrolledCourseSearchableFields.map(field => ({
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
  const whereCondition: Prisma.StudentEnrolledCourseWhereInput =
    andConditions.length ? { AND: andConditions } : {};

  // EXECUTE QUERY
  const result = await prisma.studentEnrolledCourse.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // GET TOTAL COUNT
  const total = await prisma.studentEnrolledCourse.count();

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
const updateStudentEnrolledCourse = async (
  id: string,
  payload: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse> => {
  // CHECK IF THE STUDENT ENROLLED COURSE EXISTS
  const isExist = await prisma.studentEnrolledCourse.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new Error('Student enrolled course not found');
  }
  // UPDATE
  const updatedStudentEnrolledCourse =
    await prisma.studentEnrolledCourse.update({
      where: { id },
      data: payload,
    });

  // RETURN TO THE CONTROLLER
  return updatedStudentEnrolledCourse;
};

// DELETE
const deleteStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse> => {
  // CHECK IF THE STUDENT ENROLLED COURSE EXISTS
  const isExist = await prisma.studentEnrolledCourse.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new Error('Student enrolled course not found');
  }
  // DELETE
  const deletedStudentEnrolledCourse =
    await prisma.studentEnrolledCourse.delete({
      where: { id },
    });

  // RETURN TO THE CONTROLLER
  return deletedStudentEnrolledCourse;
};

// EXPORTING THE SERVICE
export const StudentEnrolledCourseService = {
  createStudentEnrolledCourse,
  getSingleStudentEnrolledCourse,
  getAllStudentEnrolledCourse,
  updateStudentEnrolledCourse,
  deleteStudentEnrolledCourse,
};
