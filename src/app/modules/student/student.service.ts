/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Student } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilters } from './student.interface';

const createStudent = async (payload: Student): Promise<Student | null> => {
  const result = await prisma.student.create({
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};
const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: { id },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map(field => ({
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

  const whereCondition: Prisma.StudentWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.student.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const total = await prisma.student.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student | null> => {
  console.log(payload);
  const isExist = await prisma.student.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  // Update the student document
  const result = await prisma.student.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const deleteStudent = async (id: string): Promise<Student | null> => {
  const isExist = await prisma.student.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const result = await prisma.student.delete({
    where: { id },
  });

  return result;
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
