export type IStudentEnrolledCourseFilterRequest = {
  searchTerm?: string;
  studentId?: string;
  academicSemesterId?: string;
  grade?: string;
  examType?: string;
};

export type IStudentEnrolledCourseFilterableFields =
  keyof IStudentEnrolledCourseFilterRequest;
