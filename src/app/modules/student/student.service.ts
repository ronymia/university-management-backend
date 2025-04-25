/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  SemesterRegistrationStatus,
  Student,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { studentSearchableFields } from './student.constant';
import { IStudentFilters } from './student.interface';
import { StudentUtils } from './student.utils';

const createStudent = async (payload: Student): Promise<Student | null> => {
  const result = await prisma.student.create({
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};
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

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student | null> => {
  console.log(payload);
  const isExist = await prisma.student.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  // Update the student document
  const result = await prisma.student.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const deleteStudent = async (id: string): Promise<Student | null> => {
  const isExist = await prisma.student.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const result = await prisma.student.delete({
    where: { id },
  });

  return result;
};

// MY COURSES
const myCourses = async (
  authUserId: string,
  filters: {
    academicSemesterId?: string;
    courseId?: string;
  }
): Promise<any> => {
  if (!filters.academicSemesterId) {
    const getCurrentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    //
    filters.academicSemesterId = getCurrentAcademicSemester?.id;
  }

  //
  const studentEnrolledCourses = await prisma.studentEnrolledCourse.findFirst({
    where: {
      academicSemesterId: filters.academicSemesterId,
      student: {
        studentId: authUserId,
      },
    },
    include: {
      course: true,
    },
  });

  if (!studentEnrolledCourses) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No courses found for the student'
    );
  }

  return studentEnrolledCourses;
};

const mySemesterRegCourses = async (authUserId: string): Promise<any> => {
  const getStudent = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  if (!getStudent) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const getSemesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
  });

  if (!getSemesterRegistration) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No semester registration found');
  }

  // GET STUDENT COMPLETED COURSES
  const studentCompletedCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: { id: getStudent.id },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
    },
  });

  // GET STUDENT CURRENT SEMESTER TAKEN COURSES
  const studentCurrentSemesterTakenCourses =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        studentId: getStudent.id,
        semesterRegistrationId: getSemesterRegistration?.id,
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

  // GET ALL OFFERED COURSES
  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: getSemesterRegistration?.id,
      },
      academicDepartment: {
        id: getStudent?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const availableCourses = await StudentUtils.getAvailableCourses(
    offeredCourse,
    studentCompletedCourses,
    studentCurrentSemesterTakenCourses
  );

  return availableCourses;
};

// EXPORT
export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
  myCourses,
  mySemesterRegCourses,
};
