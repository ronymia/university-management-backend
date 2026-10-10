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

// CREATE ADMIN
const createAdmin = async (payload: Admin): Promise<Admin | null> => {
  const result = await prisma.admin.create({
    data: payload,
  });
  return result;
};

// GET SINGLE ADMIN
const getSingleAdmin = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: { id },
  });
  return result;
};

// GET ALL ADMIN
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

  // META
  const totalCount = await prisma.admin.count();
  // GET TOTAL COUNT (based on same filters!)
  const paginationTotal = result?.length;

  const totalPages = Math.ceil(totalCount / limit);

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

// UPDATE ADMIN
const updateAdmin = async (
  id: string,
  payload: Partial<Admin>
): Promise<Admin | null> => {
  // console.log(payload);
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

// DELETE ADMIN
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

// CREATE ADMIN FROM EVENT
const createAdminFromEvent = async (payload: any) => {
  await createAdmin(payload);
};

// EXPORT SERVICES
export const AdminService = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  createAdminFromEvent,
};
