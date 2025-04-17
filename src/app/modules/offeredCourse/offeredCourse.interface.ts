export type IOfferedCourse = {
  courseIds: string[];
  academicDepartmentId: string;
  semesterRegistrationId: string;
};

export type IOfferedCourseFilters = {
  searchTerm: string;
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseId: string;
};

export type IOfferedCourseFilterableFields =
  | 'searchTerm'
  | 'id'
  | 'courseId'
  | 'semesterRegistrationId'
  | 'academicDepartmentId';
