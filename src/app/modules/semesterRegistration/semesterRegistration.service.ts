import {
  Course,
  OfferedCourse,
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
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
  ICourseEnrollment,
  ISemesterRegistrationFilterableFields,
  ISemesterRegistrationFilters,
} from './semesterRegistration.interface';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';
import asyncForEach from '../../../shared/asyncForEach';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/studentSemesterPayment.service';

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
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration;
  studentSemesterRegistration: StudentSemesterRegistration;
}> => {
  // GET STUDENT INFO
  const studentInfo = await prisma.student.findUnique({
    where: {
      studentId: authUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student not found');
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });
  if (!semesterRegistrationInfo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration not found'
    );
  }

  const studentEnrolledSemesters =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        studentId: studentInfo.id,
        semesterRegistrationId: semesterRegistrationInfo.id,
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
          id: studentInfo.id,
        },
      },
      semesterRegistration: {
        connect: {
          id: semesterRegistrationInfo.id,
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

const enrolledIntoCourse = async ({
  authUserId,
  payload,
}: {
  authUserId: string;
  payload: ICourseEnrollment;
}): Promise<{ message: string }> => {
  return await StudentSemesterRegistrationCourseService.enrolledIntoCourse({
    authUserId,
    payload,
  });
};

// WITHDRAW FROM COURSE
const withdrawFromEnrolledCourse = async ({
  authUserId,
  payload,
}: {
  authUserId: string;
  payload: ICourseEnrollment;
}): Promise<{ message: string }> => {
  return await StudentSemesterRegistrationCourseService.withdrawFromEnrolledCourse(
    {
      authUserId,
      payload,
    }
  );
};

// CONFIRM MY REGISTRATION
const confirmMyRegistration = async ({
  authUserId,
}: {
  authUserId: string;
}): Promise<{ message: string }> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistrationId: semesterRegistration?.id,
        student: {
          studentId: authUserId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not registered for this semester'
    );
  }

  if (studentSemesterRegistration?.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not recognized for this semester'
    );
  }

  if (
    (studentSemesterRegistration?.totalCreditsTaken &&
      semesterRegistration?.minCredit &&
      semesterRegistration?.minCredit >
        studentSemesterRegistration?.totalCreditsTaken) ||
    (studentSemesterRegistration?.totalCreditsTaken &&
      semesterRegistration?.maxCredit &&
      semesterRegistration?.maxCredit <
        studentSemesterRegistration?.totalCreditsTaken)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can only take ${semesterRegistration?.minCredit} To ${semesterRegistration?.maxCredit} credits`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration?.id,
    },
    data: {
      isConfirm: true,
    },
    include: {
      student: true,
    },
  });
  return {
    message: 'Your registration is confirmed',
  };
};
// GWR MY REGISTRATION
const getMyRegistration = async ({ authUserId }: { authUserId: string }) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      offeredCourses: true,
      offeredCourseSections: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });
  return { semesterRegistration, studentSemesterRegistration };
};

// START NEW SEMESTER
const startNewSemester = async (id: string): Promise<any> => {
  // GET ACADEMIC SEMESTER
  const getAcademicSemester = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });

  if (!getAcademicSemester) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester not found');
  }

  if (getAcademicSemester.isCurrent) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Current semester registration is already started'
    );
  }

  const getSemesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      academicSemesterId: getAcademicSemester.id,
    },
  });

  // if (getSemesterRegistration?.status !== SemesterRegistrationStatus.ENDED) {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     'Semester registration is not ended'
  //   );
  // }

  await prisma.$transaction(async transactionClient => {
    // UPDATE SEMESTER REGISTRATION
    await transactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    // UPDATE SEMESTER REGISTRATION
    await transactionClient.academicSemester.update({
      where: {
        id,
      },
      data: {
        isCurrent: true,
      },
      include: {
        semesterRegistrations: true,
      },
    });

    const studentSemesterRegistration =
      await transactionClient.studentSemesterRegistration.findMany({
        where: {
          semesterRegistrationId: getSemesterRegistration?.id,
          isConfirm: true,
        },
      });

    await asyncForEach(
      studentSemesterRegistration,
      async (studentSemesterReg: StudentSemesterRegistration) => {
        const studentSemesterRegistrationCourses =
          await transactionClient.studentSemesterRegistrationCourse.findMany({
            where: {
              semesterRegistrationId: getSemesterRegistration?.id,
              studentId: studentSemesterReg.studentId,
            },
            include: {
              offeredCourse: {
                include: {
                  course: true,
                },
              },
            },
          });

        // UPDATE STUDENT SEMESTER REGISTRATION
        await asyncForEach(
          studentSemesterRegistrationCourses,
          async (
            studentSemesterRegCourse: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            }
          ) => {
            // SEMESTER PAYMENT
            if (studentSemesterReg.totalCreditsTaken) {
              const totalPaymentAmount =
                studentSemesterReg.totalCreditsTaken * 500;

              await StudentSemesterPaymentService.createSemesterPayment(
                transactionClient,
                {
                  studentId: studentSemesterReg.studentId,
                  academicSemesterId:
                    getSemesterRegistration?.academicSemesterId,
                  totalPaymentAmount: totalPaymentAmount,
                }
              );
            }

            // CHECK IF STUDENT ENROLLED COURSE EXISTS
            const studentEnrolledCourse =
              await transactionClient.studentEnrolledCourse.findFirst({
                where: {
                  studentId: studentSemesterReg.studentId,
                  courseId: studentSemesterRegCourse.offeredCourse.course.id,
                  academicSemesterId:
                    getSemesterRegistration?.academicSemesterId,
                },
              });

            if (!studentEnrolledCourse) {
              const studentEnrolledCourseData = {
                studentId: studentSemesterReg.studentId,
                courseId: studentSemesterRegCourse.offeredCourse.course.id,
                academicSemesterId: getSemesterRegistration?.academicSemesterId,
              };
              // UPDATE STUDENT SEMESTER REGISTRATION COURSE
              await transactionClient.studentEnrolledCourse.create({
                data: studentEnrolledCourseData,
              });
            }
          }
        );

        //
      }
    );
  });

  return { message: `Semester started successfully` };
};

// EXPORT
export const SemesterRegistrationService = {
  createSemesterRegistration,
  getSingleSemesterRegistration,
  getAllSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  enrollIntoSemesterRegistration,
  enrolledIntoCourse,
  withdrawFromEnrolledCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
};
