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

export const EVENT_OFFERED_COURSE_CREATED = 'offered-course.created';
export const EVENT_OFFERED_COURSE_UPDATED = 'offered-course.updated';
export const EVENT_OFFERED_COURSE_DELETED = 'offered-course.deleted';
