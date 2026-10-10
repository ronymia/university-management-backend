import { z } from 'zod';

// CREATE
const createOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z
      .string({
        required_error: 'academicDepartmentId field is required',
        invalid_type_error: 'Academic Department Id must be string',
      })
      .nonempty({ message: 'Academic Department Id is required' }),
    semesterRegistrationId: z
      .string({
        required_error: 'semesterRegistrationId field is required',
        invalid_type_error: 'Semester Registration Id must be string',
      })
      .nonempty({ message: 'Semester Registration Id is required' }),
    courseIds: z
      .array(
        z.string({
          required_error: 'courseIds is required',
          invalid_type_error: 'Course Id must be string',
        })
      )
      .min(1, 'At least one Course ID must be provided'),
  }),
});

// UPDATE
const updateOfferedCourseZodSchema = z.object({
  // params: z.object({
  //   id: z.string({
  //     required_error: 'Id is required',
  //     invalid_type_error: 'Id must be string',
  //   }),
  // }),
  body: z.object({
    academicDepartmentId: z
      .string({
        required_error: 'academicDepartmentId field is required',
        invalid_type_error: 'Academic Department Id must be string',
      })
      .nonempty({ message: 'Academic Department Id is required' })
      .optional(),
    semesterRegistrationId: z
      .string({
        required_error: 'semesterRegistrationId field is required',
        invalid_type_error: 'Semester Registration Id must be string',
      })
      .nonempty({ message: 'Semester Registration Id is required' })
      .optional(),
    courseId: z
      .string({
        required_error: 'courseIds is required',
        invalid_type_error: 'Course Id must be string',
      })
      .min(1, 'At least one Course ID must be provided')
      .optional(),
  }),
});

// EXPORT
export const OfferedCourseValidation = {
  createOfferedCourseZodSchema,
  updateOfferedCourseZodSchema,
};
