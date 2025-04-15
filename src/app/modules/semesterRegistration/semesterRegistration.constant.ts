import { SemesterRegistrationStatus } from '@prisma/client';

export const semesterRegistrationSearchableFields: string[] = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const semesterRegistrationFilterableFields: string[] = [
  'searchTerm',
  'title',
  'code',
  'startMonth',
  'endMonth',
];

// export const enum SemesterRegistrationStatus {
//   UPCOMING = SemesterRegistrationStatus.UPCOMING,
//   ONGOING = SemesterRegistrationStatus.ONGOING,
//   ENDED = SemesterRegistrationStatus.ENDED,
// }

export const semesterRegistrationStatus: string[] = [
  SemesterRegistrationStatus.UPCOMING,
  SemesterRegistrationStatus.ONGOING,
  SemesterRegistrationStatus.ENDED,
];

export const semesterRegistrationStatusFilterableFields: string[] = [
  'searchTerm',
  'status',
];

export const semesterRegistrationStatusSearchableFields: string[] = ['status'];
