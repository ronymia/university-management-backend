import {
  IAcademicSemesterCodes,
  IAcademicSemesterFilterableFields,
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

export const academicSemesterSearchableFields: IAcademicSemesterFilterableFields[] =
  ['title', 'code', 'year'];

export const academicSemesterFilterRequest: IAcademicSemesterFilterableFields[] =
  ['searchTerm', 'title', 'code', 'year'];

export const academicSemesterTitleCodeMapper: { [key: string]: string } = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic-semesters.created';
export const EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic-semesters.updated';
export const EVENT_ACADEMIC_SEMESTER_DELETED = 'academic-semesters.deleted';
export const EVENT_ACADEMIC_SEMESTER_GET_BY_ID = 'academic-semesters.getById';
export const EVENT_ACADEMIC_SEMESTER_GET_ALL = 'academic-semesters.getAll';
