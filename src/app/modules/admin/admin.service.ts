/* eslint-disable @typescript-eslint/no-explicit-any */
import { Admin, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { adminSearchableFields } from './admin.constant';
import { IAdminFilters } from './admin.interface';

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

// const updateAdmin = async (
//     id: string,
//     payload: Partial<IAdmin>,
// ): Promise<IAdmin | null> => {
//     const isExist = await Admin.findOne({ id });

//     if (!isExist) {
//         throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found !');
//     }

//     const { name, ...adminData } = payload;

//     const updatedAdminData: Partial<IAdmin> = { ...adminData };

//     if (name && Object.keys(name).length > 0) {
//         Object.keys(name).forEach((key) => {
//             const nameKey = `name.${key}` as keyof Partial<IAdmin>;
//             (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
//         });
//     }

//     const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
//         new: true,
//     });
//     return result;
// };

// const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
//     // check if the faculty is exist
//     const isExist = await Admin.findOne({ id });

//     if (!isExist) {
//         throw new ApiError(StatusCodes.NOT_FOUND, 'Admin not found !');
//     }

//     const session = await mongoose.startSession();

//     try {
//         session.startTransaction();
//         //delete admin first
//         const admin = await Admin.findOneAndDelete({ id }, { session });
//         if (!admin) {
//             throw new ApiError(404, 'Failed to delete Admin');
//         }
//         //delete user
//         await User.deleteOne({ id });
//         session.commitTransaction();
//         session.endSession();

//         return admin;
//     } catch (error) {
//         session.abortTransaction();
//         throw error;
//     }
// };

export const AdminService = {
  getAllAdmins,
  getSingleAdmin,
  // updateAdmin,
  // deleteAdmin,
};
