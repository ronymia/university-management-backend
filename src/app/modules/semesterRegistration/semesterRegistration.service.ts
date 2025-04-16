import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  semesterRegistrationNumericFilterableFields,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import { ISemesterRegistrationFilters } from './semesterRegistration.interface';

// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = async (
  payload: SemesterRegistration
): Promise<any> => {
  // CHECK IF SEMESTER REGISTRATION EXISTS
  const isExist = await prisma.semesterRegistration.findFirst({
    where: {
      academicSemesterId: payload.academicSemesterId,
      OR: [
        {
          status: SemesterRegistrationStatus.UPCOMING,
        },
        {
          status: SemesterRegistrationStatus.ONGOING,
        },
      ],
    },
  });

  // THROW ERROR
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `This Semester registration already ${isExist.status}`
    );
  }

  // CREATE
  const result = await prisma.semesterRegistration.create({
    data: payload,
  });

  // RETURN
  return result;
};

// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = async (id: string): Promise<any> => {
  // GET BY ID
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // RETURN
  return result;
};

// GET ALL SEMESTER REGISTRATION
const getAllSemesterRegistration = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
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
      OR: semesterRegistrationSearchableFields.map(field => ({
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
        if (semesterRegistrationNumericFilterableFields.includes(field)) {
          return { [field]: Number(value) };
        }

        // Keep status/code/startDate/endDate as-is
        return { [field]: value };
      }),
    });
  }

  // QUERY
  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // EXECUTE QUERY
  const result = await prisma.semesterRegistration.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // TOTAL COUNT
  const total = await prisma.semesterRegistration.count({
    where: whereCondition,
  });

  // RETURN
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<any>
): Promise<any> => {
  // CHECK IF SEMESTER REGISTRATION EXISTS
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // THROW ERROR
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  // UPDATE
  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
  });

  // RETURN
  return result;
};

// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = async (id: string): Promise<any> => {
  // CHECK IF SEMESTER REGISTRATION EXISTS
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // THROW ERROR
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  // DELETE
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
  });

  // RETURN
  return result;
};

// EXPORT
export const SemesterRegistrationService = {
  createSemesterRegistration,
  getSingleSemesterRegistration,
  getAllSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
