import { Model, Types } from 'mongoose';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface';

export type IAcademicDepartment = {
    title: string;
    academicFaculty: Types.ObjectId | IAcademicFaculty;
    // academicFacultyId: string;
    syncId: string;
};

export type AcademicDepartmentModel = Model<
    IAcademicDepartment,
    Record<string, unknown>
>;

export type IAcademicDepartmentFilterRequest = {
    searchTerm?: string;
    academicFaculty?: Types.ObjectId;
};

export type IAcademicDepartmentFilters = {
    searchTerm?: string;
    title?: string;
    academicFaculty?: Types.ObjectId;
};

export type IAcademicDepartmentCreateFromEvent = {
    title: string;
    academicFacultyId: string;
    syncId: string;
};
