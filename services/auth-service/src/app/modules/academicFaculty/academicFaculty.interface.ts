import { Model, Types } from 'mongoose';

export type IAcademicFaculty = {
    _id: Types.ObjectId;
    title: string;
    syncId: string;
};

export type AcademicFacultyModel = Model<
    IAcademicFaculty,
    Record<string, unknown>
>;

export type IAcademicFacultyFilters = {
    searchTerm?: string;
};
