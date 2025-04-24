import { StudentEnrolledCourseStatus } from '@prisma/client';
import { z } from 'zod';

const updateStudentEnrolledCourseSchema = z.object({
  body: z.object({
    studentId: z
      .string({
        required_error: 'studentId field is required',
        invalid_type_error: 'studentId field must be a string',
      })
      .nonempty(),
    courseId: z
      .string({
        required_error: 'courseId field is required',
        invalid_type_error: 'courseId field must be a string',
      })
      .nonempty(),
    academicSemesterId: z
      .string({
        required_error: 'academicSemesterId field is required',
        invalid_type_error: 'academicSemesterId field must be a string',
      })
      .nonempty(),
    status: z.enum(
      Object.values(StudentEnrolledCourseStatus) as [string, ...string[]]
    ),
    grade: z
      .string({
        required_error: 'grade field is required',
        invalid_type_error: 'grade field must be a string',
      })
      .nonempty(),
    points: z
      .number({
        required_error: 'points field is required',
        invalid_type_error: 'points field must be a number',
      })
      .nonnegative(),
    totalMarks: z
      .number({
        required_error: 'totalMarks field is required',
        invalid_type_error: 'totalMarks field must be a number',
      })
      .nonnegative(),
  }),
});

// EXPORT
export const studentEnrolledCourseValidation = {
  updateStudentEnrolledCourseSchema,
};
