import { StudentSemesterRegistration } from '@prisma/client';
import { prisma } from '../../../shared/prisma';

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

  return deletedStudentSemesterRegistration;
};

// EXPORT THE SERVICE
export const StudentSemesterRegistrationService = {
  updateStudentSemesterRegistration,
  deleteStudentSemesterRegistration,
};
