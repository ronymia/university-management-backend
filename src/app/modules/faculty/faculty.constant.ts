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
