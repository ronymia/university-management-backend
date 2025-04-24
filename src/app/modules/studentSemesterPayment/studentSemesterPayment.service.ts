import { Prisma, PrismaClient, StudentSemesterPayment } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { studentSemesterPaymentSearchableFields } from './studentSemesterPayment.constant';
import { IStudentSemesterPaymentFilterRequest } from './studentSemesterPayment.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';

// CREATE SEMESTER PAYMENT
const createSemesterPayment = async (
  prismaClient: Parameters<Parameters<PrismaClient['$transaction']>[0]>[0],
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
) => {
  const getSemesterPayment =
    await prismaClient.studentSemesterPayment.findFirst({
      where: {
        studentId: payload.studentId,
        academicSemesterId: payload.academicSemesterId,
      },
    });

  if (!getSemesterPayment) {
    const paymentData = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      fullPaymentAmount: payload.totalPaymentAmount,
      partialPaymentAmount: 0,
      totalDuePaymentAmount: payload.totalPaymentAmount,
      totalPaidPaymentAmount: 0,
    };

    await prismaClient.studentSemesterPayment.create({
      data: paymentData,
    });
  }
};

// GET SINGLE SEMESTER PAYMENT
const getSingleSemesterPayment = async (
  id: string
): Promise<StudentSemesterPayment> => {
  const result = await prisma.studentSemesterPayment.findUnique({
    where: { id },
  });
  if (!result) {
    throw new Error('Student semester payment not found');
  }
  // RETURN TO THE CONTROLLER
  return result;
};

// GET ALL SEMESTER PAYMENT
const getAllSemesterPayment = async (
  filterRequest: IStudentSemesterPaymentFilterRequest,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  // PAGINATION
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filterRequest;

  // QUERY BUILDER
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableFields.map(field => ({
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
  const whereCondition: Prisma.StudentSemesterPaymentWhereInput =
    andConditions.length ? { AND: andConditions } : {};

  // EXECUTE QUERY
  const result = await prisma.studentSemesterPayment.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // GET TOTAL COUNT
  const total = await prisma.studentSemesterPayment.count();

  // RETURN
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// UPDATE SEMESTER PAYMENT
const updatedSemesterPayment = async (
  id: string,
  payload: Partial<StudentSemesterPayment>
): Promise<StudentSemesterPayment> => {
  // CHECK IF THE STUDENT SEMESTER PAYMENT EXISTS
  const isExist = await prisma.studentSemesterPayment.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new Error('Student semester payment not found');
  }

  // UPDATE
  const updatedStudentSemesterPayment =
    await prisma.studentSemesterPayment.update({
      where: { id },
      data: payload,
    });

  // RETURN TO THE CONTROLLER
  return updatedStudentSemesterPayment;
};

// DELETE SEMESTER PAYMENT
const deleteSemesterPayment = async (
  id: string
): Promise<StudentSemesterPayment> => {
  // CHECK IF THE STUDENT SEMESTER PAYMENT EXISTS
  const isExist = await prisma.studentSemesterPayment.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new Error('Student semester payment not found');
  }

  // DELETE
  const deletedStudentSemesterPayment =
    await prisma.studentSemesterPayment.delete({
      where: { id },
    });

  // RETURN TO THE CONTROLLER
  return deletedStudentSemesterPayment;
};

// EXPORT
export const StudentSemesterPaymentService = {
  createSemesterPayment,
  getSingleSemesterPayment,
  getAllSemesterPayment,
  updatedSemesterPayment,
  deleteSemesterPayment,
};
