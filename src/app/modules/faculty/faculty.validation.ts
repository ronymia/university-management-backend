import { z } from 'zod';
import { bloodGroup, gender } from '../student/student.constant';
import { designation } from './faculty.constant';

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

export const FacultyValidation = {
  updateFacultyZodSchema,
};
