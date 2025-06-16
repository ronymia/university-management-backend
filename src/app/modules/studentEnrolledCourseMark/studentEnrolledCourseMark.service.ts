import {
  ExamType,
  Prisma,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';
import { RedisClient } from '../../../shared/redis';
import { EVENT_STUDENT_ENROLLED_COURSE_MARK_UPDATED } from './studentEnrolledCourseMark.constant';

// CREATE STUDENT ENROLLED COURSE MARK

const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Prisma.TransactionClient, // enforce type
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const midtermMark = await prismaClient.studentEnrolledCourseMark.findFirst({
    where: {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      examType: ExamType.MIDTERM,
    },
  });

  if (!midtermMark) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: { ...payload, examType: ExamType.MIDTERM },
    });
  }

  const finalMark = await prismaClient.studentEnrolledCourseMark.findFirst({
    where: {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      examType: ExamType.FINAL,
    },
  });

  if (!finalMark) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: { ...payload, examType: ExamType.FINAL },
    });
  }
};

// UPDATE STUDENT ENROLLED COURSE MARK
const updateStudentEnrolledCourseMark = async (payload: any): Promise<any> => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const getStudentEnrolledCourseDefaultMark =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          studentId: studentId,
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
  // console.log({ getStudentEnrolledCourseDefaultMark });
  if (!getStudentEnrolledCourseDefaultMark) {
    throw new Error('Student enrolled course mark not found');
  }

  // GET GRADE FROM CALCULATE MARK FUNCTION
  // CHECK IF THE MARK IS VALID
  const { grade } = await StudentEnrolledCourseMarkUtils.getGradeFromMark(
    marks as number
  );

  // UPDATE
  const updatedMark = await prisma.studentEnrolledCourseMark.update({
    where: { id: getStudentEnrolledCourseDefaultMark.id },
    data: { marks, grade },
  });
  if (!updatedMark) {
    throw new Error('Failed to update student enrolled course mark');
  }

  //  PUBLISH ON REDIS
  if (updatedMark) {
    await RedisClient.publish(
      EVENT_STUDENT_ENROLLED_COURSE_MARK_UPDATED,
      JSON.stringify(updatedMark)
    );
  }

  // RETURN TO THE CONTROLLER
  return updatedMark;
};

// UPDATE FINAL MARK
const updateStudentFinalMark = async (
  payload: Partial<StudentEnrolledCourse>
): Promise<any> => {
  const { studentId, academicSemesterId, courseId } = payload;

  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        studentId: studentId,
      },
      academicSemesterId,
      courseId,
    },
  });
  if (!studentEnrolledCourse) {
    throw new Error('Student enrolled course not found');
  }

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        student: {
          studentId: studentId,
        },
        academicSemesterId,
        studentEnrolledCourseId: studentEnrolledCourse.id,
      },
    });
  if (studentEnrolledCourseMarks.length === 0) {
    throw new Error('Student enrolled course mark not found');
  }

  const midtermMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.MIDTERM)
      ?.marks || 0;
  const finalMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.FINAL)
      ?.marks || 0;
  const totalMarks =
    Math.ceil(midtermMarks * 0.4) + Math.ceil(finalMarks * 0.6);

  // console.log({ midtermMarks, finalMarks, totalMarks });

  // GET GRADE FROM CALCULATE MARK FUNCTION
  // CHECK IF THE MARK IS VALID
  const { grade, points } =
    await StudentEnrolledCourseMarkUtils.getGradeFromMark(totalMarks as number);

  // CHECK IF THE STUDENT ENROLLED COURSE MARK EXISTS
  const updateStudentEnrolledCourse = await prisma.studentEnrolledCourse.update(
    {
      where: { id: studentEnrolledCourse.id },
      data: {
        points,
        grade,
        totalMarks,
        status: StudentEnrolledCourseStatus.COMPLETED,
      },
    }
  );
  if (!updateStudentEnrolledCourse) {
    throw new Error('Failed to update student enrolled course mark');
  }

  const grades = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: studentId,
      },
    },
    include: {
      course: true,
      studentEnrolledCourseMarks: true,
      // academicSemester: true,
    },
  });
  // CALCULATE CGPA
  const academicResult = await StudentEnrolledCourseMarkUtils.calcGradeAndCGPA(
    grades
  );

  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: { student: { studentId: studentId } },
  });

  if (studentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id,
      },
      data: {
        cgpa: academicResult.cgpa,
        totalCreditCompleted: academicResult.totalCreditCompleted,
      },
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        student: {
          connect: { studentId: studentId },
        },
        cgpa: academicResult.cgpa,
        totalCreditCompleted: academicResult.totalCreditCompleted,
      },
    });
  }

  // RETURN TO THE CONTROLLER
  return grades;
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
  updateStudentFinalMark,
  getAllStudentEnrolledCourseMark,
  getSingleStudentEnrolledCourseMark,
};
