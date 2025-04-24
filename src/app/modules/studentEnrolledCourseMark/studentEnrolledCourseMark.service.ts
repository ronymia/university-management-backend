import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourseMark,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';

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

const updateStudentEnrolledCourseMark = async (
  id: string,
  payload: StudentEnrolledCourseMark
): Promise<StudentEnrolledCourseMark> => {
  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const isExist = await prisma.studentEnrolledCourseMark.findUnique({
    where: { id },
  });
  if (!isExist) {
    throw new Error('Student enrolled course mark not found');
  }

  // UPDATE
  const updatedMark = await prisma.studentEnrolledCourseMark.update({
    where: { id },
    data: payload,
  });
  if (!updatedMark) {
    throw new Error('Failed to update student enrolled course mark');
  }

  // RETURN TO THE CONTROLLER
  return updatedMark;
};

// GET SINGLE STUDENT ENROLLED COURSE MARK
const getSingleStudentEnrolledCourseMark = async (
  id: string
): Promise<StudentEnrolledCourseMark> => {
  const studentMark = await prisma.studentEnrolledCourseMark.findUnique({
    where: { id },
  });
  if (!studentMark) {
    throw new Error('Student enrolled course mark not found');
  }
  return studentMark;
};
// GET ALL STUDENT ENROLLED COURSE MARK
const getAllStudentEnrolledCourseMark = async (): Promise<
  StudentEnrolledCourseMark[]
> => {
  const studentMarks = await prisma.studentEnrolledCourseMark.findMany();
  return studentMarks;
};
// EXPORT
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  updateStudentEnrolledCourseMark,
  getAllStudentEnrolledCourseMark,
  getSingleStudentEnrolledCourseMark,
};
