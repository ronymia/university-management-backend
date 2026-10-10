import { StudentSemesterRegistration } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

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

  // UPDATE WITH OUTBOX
  const updatedStudentSemesterRegistration = await prisma.$transaction(
    async tx => {
      const result = await tx.studentSemesterRegistration.update({
        where: { id },
        data: payload,
      });

      await tx.outbox.create({
        data: {
          eventType: EVENT_STUDENT_SEMESTER_REGISTRATION_UPDATED,
          payload: JSON.stringify(result),
        },
      });

      return result;
    }
  );

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

  // DELETE WITH OUTBOX
  const deletedStudentSemesterRegistration = await prisma.$transaction(
    async tx => {
      const result = await tx.studentSemesterRegistration.delete({
        where: { id },
      });

      await tx.outbox.create({
        data: {
          eventType: EVENT_STUDENT_SEMESTER_REGISTRATION_DELETED,
          payload: JSON.stringify(result),
        },
      });

      return result;
    }
  );

  return deletedStudentSemesterRegistration;
};

// EXPORT THE SERVICE
export const StudentSemesterRegistrationService = {
  updateStudentSemesterRegistration,
  deleteStudentSemesterRegistration,
};
