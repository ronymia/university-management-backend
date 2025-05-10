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
    'email',
    'contactNo',
    'bloodGroup',
    'gender',
];

export const facultySearchableFields: string[] = [
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'id',
    'email',
    'contactNo',
];

export const EVENT_FACULTY_UPDATED = 'faculty.updated';
export const EVENT_FACULTY_DELETED = 'faculty.deleted';
