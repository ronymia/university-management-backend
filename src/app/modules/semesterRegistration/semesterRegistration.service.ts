import {
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';

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
const getAllSemesterRegistration = async (): Promise<any> => {
  // GET ALL
  const result = await prisma.semesterRegistration.findMany();

  // RETURN
  return result;
};

// UPDATE SEMESTER REGISTRATION
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<any>
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

// EXPORT
export const SemesterRegistrationService = {
  createSemesterRegistration,
  getSingleSemesterRegistration,
  getAllSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
