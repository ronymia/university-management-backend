import { AcademicFaculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { academicDepartmentSearchableFields } from '../academicDepartment/academicDepartment.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

const createAcademicFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });
  return result;
};

const getSingleAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id: id,
    },
  });
  return result;
};
const getAllAcademicFaculties = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
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

  const whereCondition: Prisma.AcademicFacultyWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.academicFaculty.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const totalCount = await prisma.academicFaculty.count();
  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: result,
  };
};

// const updateAcademicFaculty = async (
//     id: string,
//     payload: Partial<IAcademicFaculty>,
// ): Promise<IAcademicFaculty | null> => {
//     const result = await AcademicFaculty.findOneAndUpdate(
//         { _id: id },
//         payload,
//         { new: true },
//     ).populate('academicDepartments');
//     return result;
// };

// const deleteAcademicFaculty = async (
//     id: string,
// ): Promise<IAcademicFaculty | null> => {
//     const result = await AcademicFaculty.findByIdAndDelete(id).populate(
//         'academicDepartments',
//     );
//     return result;
// };

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  //   updateAcademicFaculty,
  //   deleteAcademicFaculty,
};
