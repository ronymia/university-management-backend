import { AcademicFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { academicDepartmentSearchableFields } from '../academicDepartment/academicDepartment.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

// CREATE
const createAcademicFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });

  // RETURN
  return result;
};

// GET BY ID
const getSingleAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id: id,
    },
  });

  // RETURN
  return result;
};

// GET ALL
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

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<any>
): Promise<any> => {
  const result = await prisma.academicFaculty.update({
    where: { id },
    data: payload,
  });

  // RETURN
  return result;
};

// DELETE
const deleteAcademicFaculty = async (id: string): Promise<any> => {
  const result = await prisma.academicFaculty.delete({
    where: { id },
  });
  // RETURN
  return result;
};

// EXPORT
export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
