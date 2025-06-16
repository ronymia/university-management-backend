/* eslint-disable @typescript-eslint/no-explicit-any */
import { Faculty, Prisma, Student } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { prisma } from '../../../shared/prisma';
import { facultySearchableFields } from './faculty.constant';
import {
  IFacultyFilters,
  IFacultyMyCourseStudentsRequest,
} from './faculty.interface';

const createFaculty = async (payload: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: payload,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });
  return result;
};

const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
  });
  return result;
};

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Search in Field
  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map(field => ({
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

  const whereCondition: Prisma.FacultyWhereInput = andConditions.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.faculty.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: whereCondition,
    include: {
      courses: {
        include: {
          course: true,
        },
      },
      academicDepartment: true,
      academicFaculty: true,
      offeredCourseClassSchedules: true,
    },
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty | null> => {
  const isExist = await prisma.faculty.findUnique({
    where: { facultyId: id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  // Update the faulty
  const result = await prisma.faculty.update({
    where: { facultyId: id },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });

  return result;
};

const deleteFaculty = async (id: string): Promise<Faculty | null> => {
  const isExist = await prisma.faculty.findUnique({
    where: { facultyId: id },
  });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  const result = await prisma.faculty.delete({
    where: { facultyId: id },
  });

  return result;
};

// ASSIGN COURSES
const assignCourses = async (id: string, payload: string[]): Promise<any> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId,
    })),
    skipDuplicates: true, // 🔥 Prevents error on duplicate (composite key)
  });

  const assignedCourses = await prisma.courseFaculty.findMany({
    where: {
      AND: [
        {
          facultyId: id,
        },
        {
          courseId: {
            in: payload,
          },
        },
      ],
    },
    include: {
      course: true,
    },
  });

  // RETURN
  return assignedCourses;
};

// REMOVE COURSES
const removeCourses = async (id: string, payload: string[]) => {
  // REMOVE COURSES
  await prisma.courseFaculty.deleteMany({
    where: {
      AND: [
        {
          facultyId: id,
        },
        {
          courseId: {
            in: payload,
          },
        },
      ],
    },
  });

  // GET ASSIGNED COURSES
  const assignedCourses = await prisma.courseFaculty.findMany({
    where: {
      AND: [
        {
          facultyId: id,
        },
      ],
    },
    include: {
      faculty: true,
    },
  });

  // RETURN
  return assignedCourses;
};

// MY COURSES
const myCourses = async (
  authUser: {
    userId: string;
    role: string;
  },
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUser.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedule = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      //console.log(obj)

      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;

      const existingCourse = acc.find(
        (item: any) => item.course?.id === course?.id
      );
      if (existingCourse) {
        existingCourse.sections.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: obj,
              classSchedules,
            },
          ],
        });
      }
      return acc;
    },
    []
  );
  return courseAndSchedule;
};

const getMyCourseStudents = async (
  filters: IFacultyMyCourseStudentsRequest,
  options: IPaginationOptions,
  authUser: any
): Promise<IGenericResponse<Student[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  // console.log(authUser);
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (currentAcademicSemester) {
      filters.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const offeredCourseSections =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        offeredCourse: {
          course: {
            id: filters.courseId,
          },
        },
        offeredCourseSection: {
          offeredCourse: {
            semesterRegistration: {
              academicSemester: {
                id: filters.academicSemesterId,
              },
            },
          },
          id: filters.offeredCourseSectionId,
        },
      },
      include: {
        student: true,
      },
      take: limit,
      skip,
    });
  const students = offeredCourseSections.map(
    offeredCourseSection => offeredCourseSection.student
  );

  const total = await prisma.studentSemesterRegistrationCourse.count({
    where: {
      offeredCourse: {
        course: {
          id: filters.courseId,
        },
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filters.academicSemesterId,
            },
          },
        },
        id: filters.offeredCourseSectionId,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: students,
  };
};
// CREATE FACULTY FROM EVENT
const createFacultyFromEvent = async (event: any) => {
  await createFaculty(event);
};
// UPDATE FACULTY FROM EVENT
const updateFacultyFromEvent = async (event: any) => {
  await updateFaculty(event.facultyId, event);
};
// UPDATE FACULTY FROM EVENT
const deleteFacultyFromEvent = async (facultyId: any) => {
  await deleteFaculty(facultyId);
};

// EXPORT SERVICES
export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
  myCourses,
  getMyCourseStudents,
  createFacultyFromEvent,
  updateFacultyFromEvent,
  deleteFacultyFromEvent,
};
