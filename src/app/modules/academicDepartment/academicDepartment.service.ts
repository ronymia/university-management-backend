import { AcademicDepartment, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  academicDepartmentSearchableFields,
  EVENT_ACADEMIC_DEPARTMENT_CREATED,
} from './academicDepartment.constant';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';
import { RedisClient } from '../../../shared/redis';

// CREATE ACADEMIC DEPARTMENT
const createAcademicDepartment = async (
  payload: AcademicDepartment
): Promise<AcademicDepartment | null> => {
  // VALIDATE ACADEMIC FACULTY ID EXISTS
  const facultyExists = await prisma.academicFaculty.findUnique({
    where: { id: payload.academicFacultyId },
  });
  //
  if (!facultyExists) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      'Invalid academicFacultyId'
    );
  }
  // CREATE ACADEMIC DEPARTMENT
  const result = await prisma.academicDepartment.create({
    data: payload,
    include: {
      academicFaculty: true,
    },
  });

  // PUBLISH EVENT ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_DEPARTMENT_CREATED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};
// GET BY ID
const getSingleAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: { id },
    include: {
      academicFaculty: true,
    },
  });

  // RETURN
  return result;
};

// GET ALL FROM DB
const getAllAcademicDepartments = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  // PAGINATION
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filters;

  // QUERY BUILDER
  const andCondition = [];

  // Search in Field
  if (searchTerm) {
    andCondition.push({
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
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  // BUILD QUERY
  const whereCondition: Prisma.AcademicDepartmentWhereInput =
    andCondition.length ? { AND: andCondition } : {};

  // EXECUTE QUERY
  const result = await prisma.academicDepartment.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      academicFaculty: true,
      faculties: true,
      students: true,
    },
  });

  // GET TOTAL COUNT
  const totalCount = await prisma.academicDepartment.count();

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

// UPDATE
const updateAcademicDepartment = async (
  id: string,
  payload: Partial<any>
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.update({
    where: { id },
    data: payload,
  });

  // RETURN
  return result;
};

// DELETE
const deleteAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.delete({
    where: { id },
  });

  // RETURN
  return result;
};

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment,
};
