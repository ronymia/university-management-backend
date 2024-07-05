/* eslint-disable @typescript-eslint/no-explicit-any */
import { Faculty, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import { IFacultyFilters } from './faculty.interface';

const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
  });
  return result;
};

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
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

  const whereCondition: Prisma.FacultyWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.faculty.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// const updateFaculty = async (
//   id: string,
//   payload: Partial<IFaculty>
// ): Promise<IFaculty | null> => {
//   //
//   const isExist = await Faculty.findOne({ id });
//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
//   }

//   const { name, ...faculty } = payload;

//   //
//   // Create a new object to hold the update data
//   const studentData: Partial<IFaculty> & Record<string, any> = { ...faculty };

//   // Update the nested name fields
//   if (name && Object.keys(name).length > 0) {
//     Object.keys(name).forEach(key => {
//       studentData[`name.${key}`] = name[key as keyof typeof name];
//     });
//   }

//   // Update the student document
//   const result = await Faculty.findOneAndUpdate({ id }, studentData, {
//     new: true,
//   })
//     .populate('academicDepartment')
//     .populate('academicFaculty');

//   return result;
// };

// const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
//   const isExist = Faculty.findOne({ id });

//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
//   }

//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();
//     // delete faculty first
//     const faculty = await Faculty.findByIdAndDelete({ id }, { session });

//     if (!faculty) {
//       throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete faculty');
//     }
//     //delete user
//     await User.deleteOne({ id });
//     session.commitTransaction();
//     session.endSession();

//     return faculty;
//   } catch (error) {
//     session.commitTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const FacultyService = {
  getAllFaculties,
  getSingleFaculty,
  //   updateFaculty,
  //   deleteFaculty,
};
