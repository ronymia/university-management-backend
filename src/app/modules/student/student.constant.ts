import { IBloodGroup, IGender } from './student.interface';

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

export const studentFilterableFields = [
  'searchTerm',
  'firstName',
  'middleName',
  'lastName',
  'email',
  'contactNo',
  'bloodGroup',
  'gender',
];

export const studentSearchableFields: string[] = [
  'firstName',
  'middleName',
  'lastName',
  'id',
  'email',
  'contactNo',
];
