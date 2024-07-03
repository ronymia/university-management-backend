/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

const createAcademicSemesterZodSchema = z.object({
  body: z
    .object({
      title: z.enum([...academicSemesterTitles] as [string, ...string[]], {
        required_error: 'Title is required',
        invalid_type_error: `Acceptable values : ${academicSemesterTitles.join(
          ', '
        )}`,
      }),
      year: z.number({
        required_error: 'Year is required',
        invalid_type_error: 'Year must be a number',
      }),
      code: z
        .enum([...academicSemesterCodes] as [string, ...string[]], {
          required_error: 'Code is required',
        })
        .refine((value: any) => academicSemesterCodes.includes(value), {
          message: `Invalid code value. Acceptable values: ${academicSemesterCodes.join(
            ', '
          )}`,
        }),
      startMonth: z
        .enum([...academicSemesterMonths] as [string, ...string[]], {
          required_error: 'Start month is required',
        })
        .refine((value: any) => academicSemesterMonths.includes(value), {
          message: `Invalid start month value. Acceptable values: ${academicSemesterMonths.join(
            ', '
          )}`,
        }),
      endMonth: z
        .enum([...academicSemesterMonths] as [string, ...string[]], {
          required_error: 'End month is required',
        })
        .refine((value: any) => academicSemesterMonths.includes(value), {
          message: `Invalid end month value. Acceptable values: ${academicSemesterMonths.join(
            ', '
          )}`,
        }),
    })
    .refine(data => data.startMonth !== data.endMonth, {
      message: 'Start month and end month cannot be the same',
      path: ['endMonth'],
    }),
});

export const AcademicSemesterZodSchema = {
  createAcademicSemesterZodSchema,
};
