import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';

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
        academicSemesterId: payload.academicSemesterId,
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
        examType: ExamType.FINAL,
      },
    });

  if (!getStudentFinalCourseMark) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: { ...payload, examType: ExamType.FINAL },
    });
  }
};

const updateStudentEnrolledCourseMark = async (payload: any): Promise<any> => {
  const { studentId, academicSemesterId, courseId, examType, mark } = payload;

  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const getStudentEnrolledCourseDefaultMark =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: { id: academicSemesterId },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });
  if (!getStudentEnrolledCourseDefaultMark) {
    throw new Error('Student enrolled course mark not found');
  }

  // GET GRADE FROM CALCULATE MARK FUNCTION
  // CHECK IF THE MARK IS VALID
  const { grade } = await StudentEnrolledCourseMarkUtils.getGradeFromMark(
    mark as number
  );

  // UPDATE
  const updatedMark = await prisma.studentEnrolledCourseMark.update({
    where: { id: getStudentEnrolledCourseDefaultMark.id },
    data: { mark, grade },
  });
  if (!updatedMark) {
    throw new Error('Failed to update student enrolled course mark');
  }

  // RETURN TO THE CONTROLLER
  return updatedMark;
};

// UPDATE FINAL MARK
const updateFinalMark = async (
  payload: Partial<StudentEnrolledCourse>
): Promise<any> => {
  const { studentId, academicSemesterId, courseId } = payload;
  console.log({ payload });

  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const studentEnrolleeCourse = await prisma.studentEnrolledCourse.findFirst({
    where: { studentId, academicSemesterId, courseId },
  });
  if (!studentEnrolleeCourse) {
    throw new Error('Student enrolled course not found');
  }

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        studentId,
        academicSemesterId,
        studentEnrolledCourseId: studentEnrolleeCourse.id,
      },
    });
  if (studentEnrolledCourseMarks.length === 0) {
    throw new Error('Student enrolled course mark not found');
  }

  const midtermMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.MIDTERM)
      ?.mark || 0;
  const finalMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.FINAL)
      ?.mark || 0;
  const totalMarks =
    Math.ceil(midtermMarks * 0.4) + Math.ceil(finalMarks * 0.6);

  // GET GRADE FROM CALCULATE MARK FUNCTION
  // CHECK IF THE MARK IS VALID
  const { grade, points } =
    await StudentEnrolledCourseMarkUtils.getGradeFromMark(totalMarks as number);

  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const updateStudentEnrolleeCourse =
    await prisma.studentEnrolledCourse.updateMany({
      where: { studentId, academicSemesterId, courseId },
      data: { points, grade },
    });
  if (!updateStudentEnrolleeCourse) {
    throw new Error('Failed to update student enrolled course mark');
  }

  // RETURN TO THE CONTROLLER
  return updateStudentEnrolleeCourse;
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
  const studentMarks = await prisma.studentEnrolledCourseMark.findMany({
    include: {
      student: true,
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
      academicSemester: true,
    },
  });
  return studentMarks;
};
// EXPORT
export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  updateStudentEnrolledCourseMark,
  updateFinalMark,
  getAllStudentEnrolledCourseMark,
  getSingleStudentEnrolledCourseMark,
};
