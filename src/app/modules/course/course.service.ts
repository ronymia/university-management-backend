import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { ICourse } from './course.interface';

// CREATE
const createCourse = async (payload: ICourse): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = payload;

  const newCourse = await prisma.$transaction(async transactionClient => {
    // CREATE COURSE
    const createdCourse = await transactionClient.course.create({
      data: courseData,
    });
    // CHECK IF COURSE IS CREATED
    if (!createdCourse) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course');
    }

    // CREATE PRE REQUISITE COURSES
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await transactionClient.courseToPrerequisite.createMany({
        data: preRequisiteCourses.map((courseIds: any) => ({
          courseId: createdCourse.id,
          preRequisiteId: courseIds.courseId,
        })),
      });
    }

    // RETURN
    return createdCourse;
  });

  if (newCourse) {
    const result = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return result;
  }

  // RETURN
  throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course');
};

const getAllCourse = async (filters, paginationOptions): Promise<any> => {
  const result = await prisma.course.findMany({
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  // RETURN
  return result;
};

// GET BY ID SINGLE
const getCourseById = async (id: string): Promise<any> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  // RETURN
  return result;
};

// UPDATE
const updateCourse = async (): Promise<any> => {
  return {};
};

// DELETE
const deleteCourse = async (ids: string[]): Promise<any> => {
  const result = await prisma.course.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });
  return result;
};

// EXPORT
export const CourseServices = {
  createCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};
