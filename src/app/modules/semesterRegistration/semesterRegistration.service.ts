import {
  Course,
  ExamType,
  OfferedCourse,
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourseStatus,
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
import { StudentEnrolledCourseMarkService } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.service';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';

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
  // console.log({ filtersData });

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

        if (Array.isArray(value)) {
          return {
            [field]: {
              in: value,
            },
          };
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
    include: {
      academicSemester: true,
    },
  });

  // TOTAL COUNT
  const total = await prisma.semesterRegistration.count({
    where: whereCondition,
  });
  // GET TOTAL COUNT (based on same filters!)
  const paginationTotal = await prisma.semesterRegistration.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(total / limit);

  // RETURN
  return {
    meta: {
      page,
      limit,
      skip,
      total,
      totalPages,
      paginationTotal,
    },
    data: result,
  };
};

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
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
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Can only change status from ${SemesterRegistrationStatus.UPCOMING} To ${SemesterRegistrationStatus.ONGOING}`
    );
  } else if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
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
const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
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
      isConfirmed: true,
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
const startNewSemester = async (
  id: string
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration Not found!'
    );
  }

  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration is not ended yet!'
    );
  }

  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Semester is already started!');
  }

  await prisma.$transaction(
    async prismaTransactionClient => {
      await prismaTransactionClient.academicSemester.updateMany({
        where: {
          isCurrent: true,
        },
        data: {
          isCurrent: false,
        },
      });

      // UPDATE SEMESTER
      await prismaTransactionClient.academicSemester.update({
        where: {
          id: semesterRegistration.academicSemesterId,
        },
        data: {
          isCurrent: true,
        },
      });

      // CREATE STUDENT SEMESTER PAYMENT
      const studentSemesterRegistrations =
        await prisma.studentSemesterRegistration.findMany({
          where: {
            semesterRegistration: {
              id,
            },
            isConfirmed: true,
          },
        });

      await asyncForEach(
        studentSemesterRegistrations,
        async (studentSemReg: StudentSemesterRegistration) => {
          if (studentSemReg.totalCreditsTaken) {
            const totalSemesterPaymentAmount =
              studentSemReg.totalCreditsTaken * 5000;

            await StudentSemesterPaymentService.createSemesterPayment(
              prismaTransactionClient,
              {
                studentId: studentSemReg.studentId,
                academicSemesterId: semesterRegistration.academicSemesterId,
                totalPaymentAmount: totalSemesterPaymentAmount,
              }
            );
          }
          const studentSemesterRegistrationCourses =
            await prismaTransactionClient.studentSemesterRegistrationCourse.findMany(
              {
                where: {
                  semesterRegistration: {
                    id,
                  },
                  student: {
                    id: studentSemReg.studentId,
                  },
                },
                include: {
                  offeredCourse: {
                    include: {
                      course: true,
                    },
                  },
                },
              }
            );
          await asyncForEach(
            studentSemesterRegistrationCourses,
            async (
              item: StudentSemesterRegistrationCourse & {
                offeredCourse: OfferedCourse & {
                  course: Course;
                };
              }
            ) => {
              const isExistEnrolledData =
                await prismaTransactionClient.studentEnrolledCourse.findFirst({
                  where: {
                    student: { id: item.studentId },
                    course: { id: item.offeredCourse.courseId },
                    academicSemester: {
                      id: semesterRegistration.academicSemesterId,
                    },
                  },
                });

              // console.log({ isExistEnrolledData });

              if (!isExistEnrolledData) {
                const enrolledCourseData = {
                  studentId: item.studentId,
                  courseId: item.offeredCourse.courseId,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                };
                // console.log({ enrolledCourseData });
                const studentEnrolledCourseData =
                  await prismaTransactionClient.studentEnrolledCourse.create({
                    data: enrolledCourseData,
                  });

                await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(
                  prismaTransactionClient,
                  {
                    studentId: item.studentId,
                    studentEnrolledCourseId: studentEnrolledCourseData.id,
                    academicSemesterId: semesterRegistration.academicSemesterId,
                  }
                );
              }
            }
          );
        }
      );
    },
    {
      timeout: 10000,
    }
  );

  return {
    message: 'Semester started successfully!',
  };
};

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });
  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student Info not found!');
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

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet'
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const getMySemesterRegCourses = async (authUserId: string) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  // console.log({ student });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });
  console.log({ semesterRegistration });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'No semester registration not found!'
    );
  }

  const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: StudentEnrolledCourseStatus.COMPLETED,
      student: {
        id: student?.id,
      },
    },
    include: {
      course: true,
    },
  });

  const studentCurrentSemesterTakenCourse =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id,
        },
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });
  // console.log({ studentCurrentSemesterTakenCourse });

  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration.id,
      },
      academicDepartment: {
        id: student?.academicDepartmentId,
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

  // console.log('Offered course: ', offeredCourse);
  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    offeredCourse,
    studentCompletedCourse,
    studentCurrentSemesterTakenCourse
  );
  // console.log({ availableCourses });
  return availableCourses;
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
  startMyRegistration,
  getMySemesterRegCourses,
};
