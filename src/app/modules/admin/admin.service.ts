/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { adminSearchableFields } from './admin.constant';
import { IAdminFilters } from './admin.interface';

const createAdmin = async (payload: Admin): Promise<Admin | null> => {
  const result = await prisma.admin.create({
    data: payload,
  });
  return result;
};

const getSingleAdmin = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: { id },
  });
  return result;
};

const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Admin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map(field => ({
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

  const whereCondition: Prisma.AdminWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.admin.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const total = await prisma.admin.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateAdmin = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  console.log(payload);
  const isExist = await prisma.admin.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  // Update the faulty
  const result = await prisma.admin.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteAdmin = async (id: string): Promise<Admin | null> => {
  const isExist = await prisma.admin.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }

  const result = await prisma.admin.delete({
    where: { id },
  });

  return result;
};
export const AdminService = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
