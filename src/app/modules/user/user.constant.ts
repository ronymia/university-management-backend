import { IUserFilters } from './user.interface';

export const EVENT_STUDENT_CREATED = 'student.created';
export const EVENT_ADMIN_CREATED = 'admin.created';
export const EVENT_FACULTY_CREATED = 'faculty.created';

export const userSearchableFields: IUserFilters[] = ['id', 'email'];

export const userFilterableFields: IUserFilters[] = [
    'searchTerm',
    'id',
    'email',
];
