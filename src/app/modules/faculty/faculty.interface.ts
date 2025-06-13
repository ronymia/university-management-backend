import { Model, Types } from 'mongoose';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interface';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface';

// export enum GENDER {
//     male = 'male',
//     female = 'female',
// }

export type IBloodGroup =
    | 'A+'
    | 'A-'
    | 'B+'
    | 'B-'
    | 'AB+'
    | 'AB-'
    | 'O+'
    | 'O-';

export type IGender = 'male' | 'female';
export type IDesignation =
    | 'Lecturer'
    | 'Assistant Lecturer'
    | 'Assistant Professor'
    | 'Associate Professor'
    | 'Professor'
    | 'Senior Professor';

export type FullName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type IFaculty = {
    id?: string;
    name: FullName;
    // gender: GENDER.male | GENDER.female;
    gender: IGender;
    dateOfBirth?: string;
    email: string;
    bloodGroup?: IBloodGroup;
    contactNo: string;
    emergencyContactNo: string;
    presentAddress: string;
    permanentAddress: string;
    designation: IDesignation;
    profileImage?: string;
    academicDepartment: Types.ObjectId | IAcademicDepartment;
    academicFaculty: Types.ObjectId | IAcademicFaculty;
};

export type FacultyModel = Model<IFaculty, object>;

export type IFacultyFilters = {
    searchTerm?: string;
    id?: string;
    bloodGroup?: string;
    email?: string;
    contactNo?: string;
    emergencyContactNo?: string;
};
