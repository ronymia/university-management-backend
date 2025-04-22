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

const studentEnrolledZodSchema = z.object({
  body: z.object({
    studentId: z
      .string({
        required_error: 'studentId field is required',
        invalid_type_error: 'Student Id must be string',
      })
      .min(1, 'Student Id is required'),
    semesterRegistrationId: z
      .string({
        required_error: 'semesterRegistrationId field is required',
        invalid_type_error: 'Semester Registration Id Id must be string',
      })
      .min(1, 'Semester Registration Id is required'),
  }),
});

// EXPORT
export const SemesterRegistrationValidation = {
  createZodSchema,
  updateZodSchema,
  studentEnrolledZodSchema,
};
