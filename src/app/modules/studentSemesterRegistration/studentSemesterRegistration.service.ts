import { StudentSemesterRegistration } from '@prisma/client';
import { prisma } from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
  EVENT_STUDENT_SEMESTER_REGISTRATION_DELETED,
  EVENT_STUDENT_SEMESTER_REGISTRATION_UPDATED,
} from './studentSemesterRegistration.constant';

const updateStudentSemesterRegistration = async (
  id: string,
  payload: Partial<StudentSemesterRegistration>
): Promise<StudentSemesterRegistration> => {
  // CHECK IF THE STUDENT SEMESTER REGISTRATION EXISTS
  const existingStudentSemesterRegistration =
    await prisma.studentSemesterRegistration.findUnique({
      where: { id },
    });

  if (!existingStudentSemesterRegistration) {
    throw new Error('StudentSemesterRegistration not found');
  }

  // CHECK IF THE STUDENT SEMESTER REGISTRATION IS ACTIVE
  const updatedStudentSemesterRegistration =
    await prisma.studentSemesterRegistration.update({
      where: { id },
      data: payload,
    });

  // PUBLISH ON REDIS
  if (updatedStudentSemesterRegistration) {
    await RedisClient.publish(
      EVENT_STUDENT_SEMESTER_REGISTRATION_UPDATED,
      JSON.stringify(updatedStudentSemesterRegistration)
    );
  }

  return updatedStudentSemesterRegistration;
};

const deleteStudentSemesterRegistration = async (
  id: string
): Promise<StudentSemesterRegistration> => {
  // CHECK IF THE STUDENT SEMESTER REGISTRATION EXISTS
  const existingStudentSemesterRegistration =
    await prisma.studentSemesterRegistration.findUnique({
      where: { id },
    });

  if (!existingStudentSemesterRegistration) {
    throw new Error('StudentSemesterRegistration not found');
  }

  // CHECK IF THE STUDENT SEMESTER REGISTRATION IS ACTIVE
  const deletedStudentSemesterRegistration =
    await prisma.studentSemesterRegistration.delete({
      where: { id },
    });

  // PUBLISH ON REDIS
  if (deletedStudentSemesterRegistration) {
    await RedisClient.publish(
      EVENT_STUDENT_SEMESTER_REGISTRATION_DELETED,
      JSON.stringify(deletedStudentSemesterRegistration)
    );
  }

  return deletedStudentSemesterRegistration;
};

// EXPORT THE SERVICE
export const StudentSemesterRegistrationService = {
  updateStudentSemesterRegistration,
  deleteStudentSemesterRegistration,
};
