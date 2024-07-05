import {
  IAcademicSemesterCodes,
  IAcademicSemesterTitles,
  Months,
} from './academicSemester.interface';

export const academicSemesterTitles: IAcademicSemesterTitles[] = [
  'Autumn',
  'Fall',
  'Summer',
];
export const academicSemesterCodes: IAcademicSemesterCodes[] = [
  '01',
  '02',
  '03',
];
export const academicSemesterMonths: Months[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterSearchableFields: string[] = [
  'title',
  'code',
  'year',
];

export const academicSemesterFilterableFields: string[] = [
  'searchTerm',
  'title',
  'code',
  'year',
];
