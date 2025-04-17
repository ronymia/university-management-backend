import { IOfferedCourseFilterableFields } from './offeredCourse.interface';

export const offeredCourseSearchableFields: IOfferedCourseFilterableFields[] = [
  'courseId',
  'semesterRegistrationId',
  'academicDepartmentId',
];

export const offeredCourseFilterableFields: IOfferedCourseFilterableFields[] = [
  'searchTerm',
  'courseId',
  'semesterRegistrationId',
  'academicDepartmentId',
];
