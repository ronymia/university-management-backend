import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';
import { designation } from './faculty.constant';

// Create
const createFacultyZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    email: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
    contactNo: z.string().optional(),
    profileImage: z.string().optional(),
    designation: z.enum([...designation] as [string, ...string[]]).optional(),
    academicDepartment: z.string().optional(),
    academicFaculty: z.string().optional(),
  }),
});

// UPDATE
const updateFacultyZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    gender: z.enum([...gender] as [string, ...string[]]).optional(),
    email: z.string().optional(),
    bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
    contactNo: z.string().optional(),
    profileImage: z.string().optional(),
    designation: z.enum([...designation] as [string, ...string[]]).optional(),
    academicDepartment: z.string().optional(),
    academicFaculty: z.string().optional(),
  }),
});

// ASSIGN COURSE SCHEMA
const assignOrRemoveCoursesSchema = z.object({
  body: z.object({
    courseIds: z
      .array(
        z.string({
          required_error: 'Course id is required',
          invalid_type_error: 'Course id must be string',
        })
      )
      .nonempty('At least one Course ID must be provided'),
  }),
});

// EXPORT
export const FacultyValidation = {
  createFacultyZodSchema,
  updateFacultyZodSchema,
  assignOrRemoveCoursesSchema,
};
