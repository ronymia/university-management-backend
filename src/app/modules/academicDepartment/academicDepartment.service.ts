import { AcademicDepartment, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';

const createAcademicDepartment = async (
  payload: AcademicDepartment
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.create({
    data: payload,
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

const getSingleAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: { id },
  });
  return result;
};
const getAllAcademicDepartments = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

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

  const whereCondition: Prisma.AcademicDepartmentWhereInput =
    andCondition.length ? { AND: andCondition } : {};

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

  const totalCount = await prisma.academicDepartment.count();
  return {
    meta: {
      page,
      limit,
      total: totalCount,
    },
    data: result,
  };
};

// const updateAcademicDepartment = async (
//     id: string,
//     payload: Partial<IAcademicDepartment>,
// ): Promise<IAcademicDepartment | null> => {
//     const result = await AcademicDepartment.findOneAndUpdate(
//         { _id: id },
//         payload,
//         { new: true },
//     );
//     return result;
// };

// const deleteAcademicDepartment = async (
//     id: string,
// ): Promise<IAcademicDepartment | null> => {
//     const result = await AcademicDepartment.findByIdAndDelete(id);
//     return result;
// };

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  //   updateAcademicDepartment,
  //   deleteAcademicDepartment,
};
