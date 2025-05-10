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
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'email',
    'contactNo',
    'bloodGroup',
    'gender',
];

export const studentSearchableFields: string[] = [
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'id',
    'email',
    'contactNo',
];

export const EVENT_STUDENT_UPDATED = 'student.updated';
export const EVENT_STUDENT_DELETED = 'student.deleted';
