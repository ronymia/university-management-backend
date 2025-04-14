import { z } from 'zod';

const createSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be string',
      })
      .min(1, 'Please course Title'),

    code: z
      .string({
        required_error: 'Code is required',
        invalid_type_error: 'Code must be string',
      })
      .min(1, 'Please enter course code'),

    credits: z.number({
      required_error: 'Credits is required',
      invalid_type_error: 'Credits must be number',
    }),

    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z
            .string({
              required_error: 'Course id is required',
              invalid_type_error: 'Course id must be string',
            })
            .min(1, 'Course id is required'),
        })
      )
      .optional(),
  }),
});

const updateSchema = z.object({
  body: z.object({
    id: z
      .string({
        required_error: 'Id is required',
        invalid_type_error: 'Id must be string',
      })
      .min(1, 'Id is required'),
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be string',
      })
      .min(1, 'Please enter course Title'),
    code: z
      .string({
        required_error: 'Code is required',
        invalid_type_error: 'Code must be string',
      })
      .min(1, 'Please enter course code'),
    credits: z.number({
      required_error: 'Credits is required',
      invalid_type_error: 'Credits must be number',
    }),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string({
            required_error: 'Course id is required',
            invalid_type_error: 'Course id must be string',
          }),
        })
      )
      .optional(),
  }),
});

export const CourseValidations = {
  createSchema,
  updateSchema,
};
