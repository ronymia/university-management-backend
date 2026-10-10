import { IStudentSemesterPaymentFilterableFields } from './studentSemesterPayment.interface';

export const studentSemesterPaymentSearchableFields: IStudentSemesterPaymentFilterableFields[] =
  ['studentId', 'academicSemesterId', 'paymentStatus'];

export const studentSemesterPaymentFilterRequest: IStudentSemesterPaymentFilterableFields[] =
  ['searchTerm', 'studentId', 'academicSemesterId', 'paymentStatus'];

export const EVENT_STUDENT_SEMESTER_PAYMENT_CREATED =
  'student-semester-payment.created';
export const EVENT_STUDENT_SEMESTER_PAYMENT_UPDATED =
  'student-semester-payment.updated';
export const EVENT_STUDENT_SEMESTER_PAYMENT_DELETED =
  'student-semester-payment.deleted';
