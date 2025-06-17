import { AcademicSemester, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_DELETED,
  EVENT_ACADEMIC_SEMESTER_GET_ALL,
  EVENT_ACADEMIC_SEMESTER_GET_BY_ID,
  EVENT_ACADEMIC_SEMESTER_UPDATED,
} from './academicSemester.constant';
import { RedisClient } from '../../../shared/redis';
import { prisma } from '../../../shared/prisma';
import { IAcademicSemesterFilterRequest } from './academicSemester.interface';

// CREATE ACADEMIC SEMESTER
const createAcademicSemester = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {
  //VERIFY TITLE AND CODE MATCH
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      'Invalid academic semester code'
    );
  }

  // CREATE SEMESTER
  const result = await prisma.academicSemester.create({
    data: payload,
  });

  // PUBLISH ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_CREATED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// GET ACADEMIC SEMESTER BY ID SINGLE
const getSingleAcademicSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id: id,
    },
  });

  // PUBLISH
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_GET_BY_ID,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// GET ALL ACADEMIC SEMESTER
const getAllAcademicSemesters = async (
  filters: IAcademicSemesterFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // Extract SearchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;

  // Search and filter condition
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: academicSemesterSearchableFields.map(field => ({
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

  // If there is no condition , put {} to give all data
  const whereCondition: Prisma.AcademicSemesterWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  // EXECUTE QUERY
  const result = await prisma.academicSemester.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // GET TOTAL COUNT
  const totalCount = await prisma.academicSemester.count();
  // GET TOTAL COUNT (based on same filters!)
  const paginationTotal = await prisma.academicSemester.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalCount / limit);

  // PUBLISH ON REDIS
  if (result.length > 0) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_GET_ALL,
      JSON.stringify(result)
    );
  }

  // RETURN
  return {
    meta: {
      page,
      limit,
      skip,
      total: totalCount,
      totalPages,
      paginationTotal,
    },
    data: result,
  };
};

// UPDATE ACADEMIC SEMESTER
const updateAcademicSemester = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  // CHECK IF ACADEMIC SEMESTER EXISTS
  const isExist = await prisma.academicSemester.findUnique({
    where: { id },
  });
  // THROW ERROR
  if (!isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Academic Semester not found with ${id}`
    );
  }

  // VERIFY TITLE AND CODE MATCH
  if (
    payload.title &&
    payload.code &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(
      httpStatus.UNPROCESSABLE_ENTITY,
      'Invalid academic semester code'
    );
  }

  // UPDATE ON DATABASE
  const result = await prisma.academicSemester.update({
    where: { id },
    data: payload,
  });

  // PUBLISH ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_UPDATED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// DELETE ACADEMIC SEMESTER
const deleteAcademicSemester = async (
  id: string
): Promise<AcademicSemester> => {
  // CHECK IF ACADEMIC SEMESTER EXISTS
  const isExist = await prisma.academicSemester.findUnique({
    where: { id },
  });
  // THROW ERROR
  if (!isExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Academic Semester not found with ${id}`
    );
  }

  // DELETE ON DATABASE
  const result = await prisma.academicSemester.delete({
    where: { id },
  });

  // PUBLISH ON REDIS
  if (result) {
    await RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_DELETED,
      JSON.stringify(result)
    );
  }

  // RETURN
  return result;
};

// EXPORT SERVICES
export const AcademicSemesterService = {
  createAcademicSemester,
  getSingleAcademicSemester,
  getAllAcademicSemesters,
  updateAcademicSemester,
  deleteAcademicSemester,
};
