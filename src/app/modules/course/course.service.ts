import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { courseSearchableFields } from './course.constant';
import { ICourse, IPreRequisiteCourses } from './course.interface';

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

const getAllCourse = async (
  filters: any,
  paginationOptions: IPaginationOptions
): Promise<any> => {
  // PAGINATION
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  // FILTER
  const { searchTerm, ...filtersData } = filters;

  // QUERY BUILDER
  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // field Filtering
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  // BUILD QUERY
  const whereCondition: Prisma.CourseWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  // EXECUTE QUERY
  const result = await prisma.course.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
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

  // GET TOTAL COUNT
  const total = await prisma.course.count();

  // RETURN
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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
const updateCourse = async (id: string, payload: ICourse): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = payload;

  await prisma.$transaction(async transactionClient => {
    // UPDATE COURSE
    const updatedCourse = await transactionClient.course.update({
      where: { id },
      data: courseData,
    });
    // CHECK IF COURSE IS UPDATED
    if (!updatedCourse) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course');
    }

    // UPDATE PRE REQUISITE COURSES
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // DELETE
      const deletablePreRequisiteCourses = preRequisiteCourses.filter(
        (preRequisite: IPreRequisiteCourses) =>
          preRequisite.courseId && preRequisite.isDeleted
      );
      await transactionClient.courseToPrerequisite.deleteMany({
        where: {
          courseId: id,
          preRequisiteId: {
            in: deletablePreRequisiteCourses.map(
              (preRequisite: IPreRequisiteCourses) => preRequisite.courseId
            ),
          },
        },
      });

      // CREATE
      const newPreRequisiteCourses = preRequisiteCourses.filter(
        (preRequisite: IPreRequisiteCourses) =>
          preRequisite.courseId && !preRequisite.isDeleted
      );
      await transactionClient.courseToPrerequisite.createMany({
        data: newPreRequisiteCourses.map(
          (preRequisite: IPreRequisiteCourses) => ({
            courseId: id,
            preRequisiteId: preRequisite.courseId,
          })
        ),
      });
    }
  });

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

  return result;
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

// ASSIGN FACULTIES
const assignFaculties = async (
  id: string,
  facultyIds: string[]
): Promise<any> => {
  await prisma.courseFaculty.createMany({
    data: facultyIds.map(facultyId => ({
      courseId: id,
      facultyId,
    })),
    skipDuplicates: true, // 🔥 Prevents error on duplicate (composite key)
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      AND: [
        {
          courseId: id,
        },
        {
          facultyId: {
            in: facultyIds,
          },
        },
      ],
    },
    include: {
      faculty: true,
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
  assignFaculties,
};
