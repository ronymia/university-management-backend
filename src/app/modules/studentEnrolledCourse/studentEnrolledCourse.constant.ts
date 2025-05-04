import { IStudentEnrolledCourseFilterableFields } from './studentEnrolledCourse.interface';

export const studentEnrolledCourseFilterRequest: IStudentEnrolledCourseFilterableFields[] =
  ['searchTerm', 'studentId', 'academicSemesterId', 'grade', 'examType'];
export const studentEnrolledCourseSearchableFields: IStudentEnrolledCourseFilterableFields[] =
  ['studentId', 'academicSemesterId', 'grade', 'examType'];

export const EVENT_STUDENT_ENROLLED_COURSE_CREATED =
  'student-enrolled-course.created';
export const EVENT_STUDENT_ENROLLED_COURSE_UPDATED =
  'student-enrolled-course.updated';
export const EVENT_STUDENT_ENROLLED_COURSE_DELETED =
  'student-enrolled-course.deleted';
