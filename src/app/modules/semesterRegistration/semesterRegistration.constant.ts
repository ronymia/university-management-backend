import { SemesterRegistrationStatus } from '@prisma/client';
import { ISemesterRegistrationFilterableFields } from './semesterRegistration.interface';

export const semesterRegistrationSearchableFields: string[] = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const semesterRegistrationFilterableFields: ISemesterRegistrationFilterableFields[] =
  ['searchTerm', 'status', 'startDate', 'endDate', 'minCredit', 'maxCredit'];

export const semesterRegistrationNumericFilterableFields: ISemesterRegistrationFilterableFields[] =
  ['minCredit', 'maxCredit'];

export const semesterRegistrationStatus: string[] = [
  SemesterRegistrationStatus.UPCOMING,
  SemesterRegistrationStatus.ONGOING,
  SemesterRegistrationStatus.ENDED,
];
