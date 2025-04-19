import { z } from 'zod';

const createOfferedCourseSectionZodValidation = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'title field is required',
        invalid_type_error: 'Title must be string',
      })
      .min(1, 'Title is required'),
    maxCapacity: z
      .number({
        required_error: 'Max Capacity is required',
        invalid_type_error: 'Max Capacity must be number',
      })
      .nonnegative({
        message: 'Max Capacity must be greater than or equal to 0',
      }),
    offeredCourseId: z
      .string({
        required_error: 'offeredCourseId field is required',
        invalid_type_error: 'Offered Course Id must be string',
      })
      .min(1, 'Offered Course Id is required'),
    currentEnrolledStudent: z
      .number({
        required_error: 'currentEnrolledStudent field is required',
        invalid_type_error: 'current Enrolled Student must be number',
      })
      .nonnegative({
        message: 'Max Capacity must be greater than or equal to 0',
      }),
    SemesterRegistrationId: z
      .string({
        required_error: 'SemesterRegistrationId field is required',
        invalid_type_error: 'Semester Registration Id must be string',
      })
      .min(1, 'Semester Registration Id is required'),
  }),
});

const updateOfferedCourseSectionZodValidation = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'title field is required',
        invalid_type_error: 'Title must be string',
      })
      .min(1, 'Title is required'),
    maxCapacity: z
      .number({
        required_error: 'Max Capacity is required',
        invalid_type_error: 'Max Capacity must be number',
      })
      .nonnegative({
        message: 'Max Capacity must be greater than or equal to 0',
      }),
    offeredCourseId: z
      .string({
        required_error: 'offeredCourseId field is required',
        invalid_type_error: 'Offered Course Id must be string',
      })
      .min(1, 'Offered Course Id is required'),
    currentEnrolledStudent: z
      .number({
        required_error: 'currentEnrolledStudent field is required',
        invalid_type_error: 'current Enrolled Student must be number',
      })
      .nonnegative({
        message: 'Max Capacity must be greater than or equal to 0',
      }),
    SemesterRegistrationId: z
      .string({
        required_error: 'SemesterRegistrationId field is required',
        invalid_type_error: 'Semester Registration Id must be string',
      })
      .min(1, 'Semester Registration Id is required'),
  }),
});

export const OfferedCourseSectionValidation = {
  createOfferedCourseSectionZodValidation,
  updateOfferedCourseSectionZodValidation,
};
