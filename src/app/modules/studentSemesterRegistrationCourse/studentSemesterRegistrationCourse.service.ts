import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { ICourseEnrollment } from '../semesterRegistration/semesterRegistration.interface';
import { SemesterRegistrationStatus } from '@prisma/client';

const enrolledIntoCourse = async ({
  authUserId,
  payload,
}: {
  authUserId: string;
  payload: ICourseEnrollment;
}): Promise<{ message: string }> => {
  // GET STUDENT
  const studentInfo = await prisma.student.findUnique({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student not found');
  }

  // GET OFFERED COURSE
  const offeredCourseInfo = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });
  //
  if (!offeredCourseInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found');
  }

  // GET OFFERED COURSE SECTION
  const offeredCourseSectionInfo = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });
  //
  if (!offeredCourseSectionInfo) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered Course Section not found'
    );
  }

  // GET ONGOING SEMESTER
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Currently No Semester Registration ongoing'
    );
  }

  // CHECK STUDENT CAPACITY
  if (
    offeredCourseSectionInfo.maxCapacity &&
    offeredCourseSectionInfo.currentEnrolledStudent &&
    offeredCourseSectionInfo.currentEnrolledStudent >=
      offeredCourseSectionInfo.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student Capacity is full');
  }

  // ENROLL
  await prisma.$transaction(async transactionClient => {
    // CREATE
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: studentInfo.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    // UPDATE OFFERED COURSE SECTION CURRENT ENROLLED STUDENT
    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentEnrolledStudent: {
          increment: 1,
        },
      },
    });

    // UPDATE STUDENT TOTAL CREDITS
    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        studentId: studentInfo.id,
        semesterRegistrationId: semesterRegistration?.id,
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourseInfo.course.credits,
        },
      },
    });

    // UPDATE SEMESTER REGISTRATION TOTAL CREDITS
  });

  // RETURN
  return `Student Course Enrollment Successfully`;
};
const withdrawFromEnrolledCourse = async ({
  authUserId,
  payload,
}: {
  authUserId: string;
  payload: ICourseEnrollment;
}): Promise<{ message: string }> => {
  // GET STUDENT
  const studentInfo = await prisma.student.findUnique({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student not found');
  }

  // GET OFFERED COURSE
  const offeredCourseInfo = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });
  //
  if (!offeredCourseInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found');
  }

  // GET ONGOING SEMESTER
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Currently No Semester Registration ongoing'
    );
  }

  // ENROLL
  await prisma.$transaction(async transactionClient => {
    // CREATE
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        studentId_semesterRegistrationId_offeredCourseId: {
          studentId: studentInfo.id,
          semesterRegistrationId: semesterRegistration?.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    // UPDATE OFFERED COURSE SECTION CURRENT ENROLLED STUDENT
    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    // UPDATE STUDENT TOTAL CREDITS
    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        studentId: studentInfo.id,
        semesterRegistrationId: semesterRegistration?.id,
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourseInfo.course.credits,
        },
      },
    });

    // UPDATE SEMESTER REGISTRATION TOTAL CREDITS
  });

  // RETURN
  return `Student Course Withdraw Successfully`;
};

export const StudentSemesterRegistrationCourseService = {
  enrolledIntoCourse,
  withdrawFromEnrolledCourse,
};
