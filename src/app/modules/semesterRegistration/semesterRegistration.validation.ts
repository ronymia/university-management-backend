import { z } from 'zod';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

// CREATE
const createZodSchema = z.object({
  body: z.object({
    academicSemesterId: z
      .string({
        required_error: 'academicSemesterId field is required',
        invalid_type_error: 'Academic Semester Id must be string',
      })
      .min(1, 'Academic Semester Id is required'),
    startDate: z
      .string({
        required_error: 'startDate field is required',
        invalid_type_error: 'Start Date must be valid date',
      })
      .min(1, 'Start Date is required'),
    endDate: z
      .string({
        required_error: 'endDate field is required',
        invalid_type_error: 'End Date must be valid date',
      })
      .min(1, 'End Date is required'),
    status: z
      .enum(semesterRegistrationStatus as [string, ...string[]], {
        required_error: 'status field is required',
        invalid_type_error: `Status must be one of them : ${semesterRegistrationStatus.join(
          ', '
        )}`,
      })
      .optional(),
    minCredit: z.number({
      required_error: 'minCredit field is required',
      invalid_type_error: 'Minimum Credit must be number',
    }),
    maxCredit: z.number({
      required_error: 'maxCredit field is required',
      invalid_type_error: 'Maximum Credit must be number',
    }),
  }),
});

// UPDATE
const updateZodSchema = z.object({
  body: z.object({
    academicSemesterId: z
      .string({
        required_error: 'academicSemesterId field is required',
        invalid_type_error: 'Academic Semester Id must be string',
      })
      .min(1, 'Academic Semester Id is required'),
    startDate: z
      .string({
        required_error: 'startDate field is required',
        invalid_type_error: 'Start Date must be valid date',
      })
      .min(1, 'Start Date is required'),
    endDate: z
      .string({
        required_error: 'endDate field is required',
        invalid_type_error: 'End Date must be valid date',
      })
      .min(1, 'End Date is required'),
    status: z
      .enum(semesterRegistrationStatus as [string, ...string[]], {
        required_error: 'status field is required',
        invalid_type_error: `Status must be one of them : ${semesterRegistrationStatus.join(
          ', '
        )}`,
      })
      .optional(),
    minCredit: z.number({
      required_error: 'minCredit field is required',
      invalid_type_error: 'Minimum Credit must be number',
    }),
    maxCredit: z.number({
      required_error: 'maxCredit field is required',
      invalid_type_error: 'Maximum Credit must be number',
    }),
  }),
});

const enrolledOrWithdrawCourseZodSchema = z.object({
  body: z.object({
    offeredCourseId: z
      .string({
        required_error: 'offeredCourseId field is required',
        invalid_type_error: 'Offered Course Id must be string',
      })
      .min(1, 'Offered Course Id is required'),
    offeredCourseSectionId: z
      .string({
        required_error: 'offeredCourseSectionId field is required',
        invalid_type_error: 'Offered Course Section Id Id must be string',
      })
      .min(1, 'Offered Course Section Id is required'),
  }),
});

// EXPORT
export const SemesterRegistrationValidation = {
  createZodSchema,
  updateZodSchema,
  enrolledOrWithdrawCourseZodSchema,
};
