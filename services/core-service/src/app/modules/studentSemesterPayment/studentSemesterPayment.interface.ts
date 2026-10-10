export type IStudentSemesterPaymentFilterRequest = {
  searchTerm?: string;
  studentId?: string;
  academicSemesterId?: string;
  paymentStatus?: string;
};

export type IStudentSemesterPaymentFilterableFields =
  keyof IStudentSemesterPaymentFilterRequest;
