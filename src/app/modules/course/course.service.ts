import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { ICourse } from './course.interface';

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

const getAllCourse = (data: any) => {
  console.log({ data });
};
const getSingleCourse = () => {};
const updateCourse = () => {};
const deleteCourse = () => {};

export const CourseServices = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
};
