import { z } from 'zod';

const updateStudentSemesterRegistrationZodSchema = z.object({
  body: z.object({
    isConfirm: z.boolean({
      required_error: 'isConfirm is required',
      invalid_type_error: 'isConfirm must be a boolean',
    }),
    totalCreditsTaken: z.number({
      required_error: 'totalCreditsTaken is required',
      invalid_type_error: 'totalCreditsTaken must be a number',
    }),
    studentId: z.string({
      required_error: 'studentId is required',
      invalid_type_error: 'studentId must be a string',
    }),
    semesterRegistrationId: z.string({
      required_error: 'semesterRegistrationId is required',
      invalid_type_error: 'semesterRegistrationId must be a string',
    }),
  }),
});

export const StudentSemesterRegistrationValidation = {
  updateStudentSemesterRegistrationZodSchema,
};
