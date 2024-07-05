/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Student } from '@prisma/client';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilters } from './student.interface';

const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: { id },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map(field => ({
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

  const whereCondition: Prisma.StudentWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.student.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  const total = await prisma.student.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// const updateStudent = async (
//   id: string,
//   payload: Partial<IStudent>
// ): Promise<IStudent | null> => {
//   console.log(payload);
//   const isExist = await Student.findOne({ id });
//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
//   }

//   const { name, guardian, localGuardian, ...student } = payload;

//   //
//   // Create a new object to hold the update data
//   const studentData: Partial<IStudent> & Record<string, any> = { ...student };

//   // Update the nested name fields
//   if (name && Object.keys(name).length > 0) {
//     Object.keys(name).forEach(key => {
//       studentData[`name.${key}`] = name[key as keyof typeof name];
//     });
//   }

//   // Update the nested guardian fields
//   if (guardian && Object.keys(guardian).length > 0) {
//     Object.keys(guardian).forEach(key => {
//       studentData[`guardian.${key}`] = guardian[key as keyof typeof guardian];
//     });
//   }

//   // Update the nested localGuardian fields
//   if (localGuardian && Object.keys(localGuardian).length > 0) {
//     Object.keys(localGuardian).forEach(key => {
//       studentData[`localGuardian.${key}`] =
//         localGuardian[key as keyof typeof localGuardian];
//     });
//   }

//   // Update the student document
//   const result = await Student.findOneAndUpdate({ id }, studentData, {
//     new: true,
//   })
//     .populate('academicSemester')
//     .populate('academicDepartment')
//     .populate('academicFaculty');

//   return result;
// };

// const deleteStudent = async (id: string): Promise<IStudent | null> => {
//   const isExist = Student.findOne({ id });
//   if (!isExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
//   }
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     const student = await Student.findByIdAndDelete(id)
//       .populate('academicSemester')
//       .populate('academicDepartment')
//       .populate('academicFaculty');

//     if (!student) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Fail to delete Student');
//     }
//     await User.deleteOne({ id });

//     session.commitTransaction();
//     session.endSession();

//     return student;
//   } catch (error) {
//     session.commitTransaction();
//     session.endSession();
//     throw error;
//   }
// };

export const StudentService = {
  getAllStudents,
  getSingleStudent,
  //   updateStudent,
  //   deleteStudent,
};
