import { IBloodGroup, IDesignation, IGender } from './faculty.interface';

export const bloodGroup: IBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const gender: IGender[] = ['male', 'female'];
export const designation: IDesignation[] = ['Professor', 'Lecturer'];

export const facultyFilterableFields: string[] = [
  'searchTerm',
  'id',
  'email',
  'contactNo',
  'bloodGroup',
  'gender',
];

export const facultySearchableFields: string[] = [
  'firstName',
  'middleName',
  'lastName',
  'id',
  'email',
  'contactNo',
];

export const EVENT_FACULTY_CREATED = 'faculty.created';
export const EVENT_FACULTY_UPDATED = 'faculty.updated';
export const EVENT_FACULTY_DELETED = 'faculty.deleted';
export const EVENT_FACULTY_ASSIGNED_COURSES = 'faculty.assigned-courses';
export const EVENT_FACULTY_REMOVED_COURSES = 'faculty.removed-courses';
export const EVENT_FACULTY_MY_COURSES = 'faculty.my-courses';
