import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import {
  semesterRegistrationNumericFilterableFields,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import {
  ISemesterRegistrationFilterableFields,
  ISemesterRegistrationFilters,
} from './semesterRegistration.interface';

// CREATE SEMESTER REGISTRATION
const createSemesterRegistration = async (
  payload: SemesterRegistration
): Promise<any> => {
  // CHECK IF SEMESTER REGISTRATION EXISTS
  const isExist = await prisma.semesterRegistration.findFirst({
    where: {
      academicSemesterId: payload.academicSemesterId,
      OR: [
        {
          status: SemesterRegistrationStatus.UPCOMING,
        },
        {
          status: SemesterRegistrationStatus.ONGOING,
        },
      ],
    },
  });

  // THROW ERROR
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `This Semester registration already ${isExist.status}`
    );
  }

  // CREATE
  const result = await prisma.semesterRegistration.create({
    data: payload,
  });

  // RETURN
  return result;
};

// GET SINGLE SEMESTER REGISTRATION
const getSingleSemesterRegistration = async (id: string): Promise<any> => {
  // GET BY ID
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // RETURN
  return result;
};

// GET ALL SEMESTER REGISTRATION
const getAllSemesterRegistration = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  // PAGINATION
  const { page, skip, limit, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filters;

  // QUERY BUILDER
  const andCondition = [];

  // SEARCH IN FIELD
  if (searchTerm) {
    andCondition.push({
      OR: semesterRegistrationSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // FILTERING
  if (Object.keys(filtersData).length) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        // Convert minCredit/maxCredit to number
        if (
          semesterRegistrationNumericFilterableFields.includes(
            field as ISemesterRegistrationFilterableFields
          )
        ) {
          return { [field]: Number(value) };
        }

        // Keep status/code/startDate/endDate as-is
        return { [field]: value };
      }),
    });
  }

  // QUERY
  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // EXECUTE QUERY
  const result = await prisma.semesterRegistration.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
  });

  // TOTAL COUNT
  const total = await prisma.semesterRegistration.count({
    where: whereCondition,
  });

  // RETURN
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<any> => {
  // CHECK IF SEMESTER REGISTRATION EXISTS
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // THROW ERROR
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  //
  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status === SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Can only change status from ${SemesterRegistrationStatus.UPCOMING} To ${SemesterRegistrationStatus.ONGOING}`
    );
  } else if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status === SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Can change status from ${SemesterRegistrationStatus.ONGOING} to ${SemesterRegistrationStatus.ENDED}`
    );
  }

  // UPDATE
  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
  });

  // RETURN
  return result;
};

// DELETE SEMESTER REGISTRATION
const deleteSemesterRegistration = async (id: string): Promise<any> => {
  // CHECK IF SEMESTER REGISTRATION EXISTS
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // THROW ERROR
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Semester Registration not found');
  }

  // DELETE
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
  });

  // RETURN
  return result;
};

// ENROLL INTO SEMESTER REGISTRATION
const enrollIntoSemesterRegistration = async (
  payload: StudentSemesterRegistration
): Promise<{
  semesterRegistration: SemesterRegistration;
  studentSemesterRegistration: StudentSemesterRegistration;
}> => {
  // GET STUDENT INFO
  const studentInfo = await prisma.student.findUnique({
    where: {
      id: payload.studentId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.PRECONDITION_FAILED, 'Student not found');
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findUnique(
    {
      where: {
        id: payload.semesterRegistrationId,
        status: {
          in: [
            SemesterRegistrationStatus.ONGOING,
            SemesterRegistrationStatus.UPCOMING,
          ],
        },
      },
    }
  );
  if (!semesterRegistrationInfo) {
    throw new ApiError(
      httpStatus.PRECONDITION_FAILED,
      'Semester Registration not found'
    );
  }

  const studentEnrolledSemesters =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        studentId: payload.studentId,
        semesterRegistrationId: payload.semesterRegistrationId,
      },
    });

  if (studentEnrolledSemesters) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Student already enrolled on ${studentEnrolledSemesters.semesterRegistrationId}`
    );
  }

  // ENROLLED
  const studentEnrolled = await prisma.studentSemesterRegistration.create({
    data: {
      student: {
        connect: {
          id: payload.studentId,
        },
      },
      semesterRegistration: {
        connect: {
          id: payload.semesterRegistrationId,
        },
      },
    },
  });

  // RETURN
  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentEnrolled,
  };
};

// EXPORT
export const SemesterRegistrationService = {
  createSemesterRegistration,
  getSingleSemesterRegistration,
  getAllSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  enrollIntoSemesterRegistration,
};
