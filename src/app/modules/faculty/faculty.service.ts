/* eslint-disable @typescript-eslint/no-explicit-any */
import { Faculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import { IFacultyFilters } from './faculty.interface';

const createFaculty = async (payload: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: payload,
    include: {
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
  });
  return result;
};

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
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

  const whereCondition: Prisma.FacultyWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.faculty.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty | null> => {
  console.log(payload);
  const isExist = await prisma.faculty.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  // Update the faulty
  const result = await prisma.faculty.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
    },
  });

  return result;
};

const deleteFaculty = async (id: string): Promise<Faculty | null> => {
  const isExist = await prisma.faculty.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const result = await prisma.faculty.delete({
    where: { id },
  });

  return result;
};
export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
