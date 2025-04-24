import { IStudentSemesterPaymentFilterableFields } from './studentSemesterPayment.interface';

export const studentSemesterPaymentSearchableFields: IStudentSemesterPaymentFilterableFields[] =
  ['studentId', 'academicSemesterId', 'paymentStatus'];

export const studentSemesterPaymentFilterRequest: IStudentSemesterPaymentFilterableFields[] =
  ['searchTerm', 'studentId', 'academicSemesterId', 'paymentStatus'];
