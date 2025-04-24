import { IStudentEnrolledCourseFilterableFields } from './studentEnrolledCourse.interface';

export const studentEnrolledCourseFilterRequest: IStudentEnrolledCourseFilterableFields[] =
  ['searchTerm', 'studentId', 'academicSemesterId', 'grade', 'examType'];
export const studentEnrolledCourseSearchableFields: IStudentEnrolledCourseFilterableFields[] =
  ['studentId', 'academicSemesterId', 'grade', 'examType'];
