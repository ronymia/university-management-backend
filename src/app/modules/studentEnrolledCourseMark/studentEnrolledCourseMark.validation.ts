import { ExamType } from '@prisma/client';
import { z } from 'zod';

const updateStudentEnrolledCourseMarkZodSchema = z.object({
  body: z.object({
    studentId: z
      .string({
        required_error: 'studentId field is required',
        invalid_type_error: 'studentId must be a string',
      })
      .trim()
      .min(1, { message: 'Please Provide studentId' }),
    studentEnrolledCourseId: z
      .string({
        required_error: 'studentEnrolledCourseId field is required',
        invalid_type_error: 'studentEnrolledCourseId must be a string',
      })
      .trim()
      .min(1, { message: 'Please Provide studentEnrolledCourseId' }),
    academicSemesterId: z
      .string({
        required_error: 'academicSemesterId field is required',
        invalid_type_error: 'academicSemesterId must be a string',
      })
      .trim()
      .min(1, { message: 'Please Provide academicSemesterId' }),
    grade: z
      .string({
        required_error: 'grade field is required',
        invalid_type_error: 'grade must be a string',
      })
      .min(1, { message: 'grade must be greater than 0' }),
    mark: z
      .number({
        required_error: 'mark field is required',
        invalid_type_error: 'mark must be a number',
      })
      .min(1, { message: 'mark must be greater than 0' }),
    examType: z.enum(Object.values(ExamType) as [string, ...string[]], {
      required_error: 'examType field is required',
      invalid_type_error: 'examType must be a string',
    }),
  }),
});

export const StudentEnrolledCourseMarkValidation = {
  updateStudentEnrolledCourseMarkZodSchema,
};
