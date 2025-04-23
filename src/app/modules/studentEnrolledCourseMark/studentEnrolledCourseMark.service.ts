import { ExamType, PrismaClient } from '@prisma/client';

const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Parameters<Parameters<PrismaClient['$transaction']>[0]>[0],
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const getStudentMidtermCourseMark =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        studentId: payload.studentId,
        studentEnrolledCourseId: payload.studentEnrolledCourseId,
        examType: ExamType.MIDTERM,
      },
    });

  if (!getStudentMidtermCourseMark) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: { ...payload, examType: ExamType.MIDTERM },
    });
  }

  const getStudentFinalCourseMark =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        studentId: payload.studentId,
        studentEnrolledCourseId: payload.studentEnrolledCourseId,
        examType: ExamType.MIDTERM,
      },
    });

  if (!getStudentFinalCourseMark) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: { ...payload, examType: ExamType.FINAL },
    });
  }
};

// EXPORT
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
};
