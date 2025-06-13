import { AcademicFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { academicDepartmentSearchableFields } from '../academicDepartment/academicDepartment.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_FACULTY_CREATED,
  EVENT_ACADEMIC_FACULTY_DELETED,
  EVENT_ACADEMIC_FACULTY_UPDATED,
} from './academicFaculty.constant';

// CREATE ACADEMIC FACULTY
const createAcademicFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  // CREATE ON DATABASE
  const result = await prisma.academicFaculty.create({
    data: payload,
  });

  // PUBLISH EVENT ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_FACULTY_CREATED,
      JSON.stringify(result)
    );
  }
  // RETURN
  return result;
};

// GET ACADEMIC FACULTY BY ID
const getSingleAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  // CREATE
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });
  // IF NOT FOUND
  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `AcademicFaculty with id '${id}' not found.`
    );
  }

  // RETURN
  return result;
};

// GET ALL ACADEMIC FACULTY
const getAllAcademicFaculties = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  // PAGINATION
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  // FILTER
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: academicDepartmentSearchableFields.map(field => ({
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
  const whereCondition: Prisma.AcademicFacultyWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  // EXECUTE QUERY
  const result = await prisma.academicFaculty.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      academicDepartments: {
        include: {
          academicFaculty: true,
        },
      },
    },
  });

  // GET TOTAL COUNT
  const totalCount = await prisma.academicFaculty.count();

  // RETURN
  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: result,
  };
};

// UPDATE ACADEMIC FACULTY
const updateAcademicFaculty = async (
  id: string,
  payload: Partial<any>
): Promise<AcademicFaculty> => {
  // CHECK IF FACULTY EXISTS
  const isExist = await prisma.academicFaculty.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `AcademicFaculty not found with id ${id}`
    );
  }

  // UPDATE ON DATABASE
  const result = await prisma.academicFaculty.update({
    where: { id },
    data: payload,
  });

  // PUBLISH EVENT ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_FACULTY_UPDATED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// DELETE ACADEMIC FACULTY
const deleteAcademicFaculty = async (id: string): Promise<AcademicFaculty> => {
  // CHECK IF FACULTY EXISTS
  const isExist = await prisma.academicFaculty.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `AcademicFaculty not found with id ${id}`
    );
  }

  // DELETE ON DATABASE
  const result = await prisma.academicFaculty.delete({
    where: { id },
  });

  // PUBLISH EVENT ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_FACULTY_DELETED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// EXPORT SERVICES
export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
