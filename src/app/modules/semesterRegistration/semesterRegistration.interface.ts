import { SemesterRegistrationStatus } from '@prisma/client';

export type ISemesterRegistrationFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  status?: SemesterRegistrationStatus;
  minCredit?: number;
  maxCredit?: number;
};
export type ISemesterRegistrationFilterableFields =
  | 'searchTerm'
  | 'startDate'
  | 'endDate'
  | 'status'
  | 'minCredit'
  | 'maxCredit';
