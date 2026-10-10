import { Model, Types } from 'mongoose';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { IAcademicDepartment } from '../academicDepartment/academicDepartment.interface';
import { IAcademicFaculty } from '../academicFaculty/academicFaculty.interface';
// import { BLOOD_GROUP } from './student.constant';

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

export type FullName = {
    firstName: string;
    middleName?: string;
    lastName: string;
};

export type Guardian = {
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
    address: string;
};

export type LocalGuardian = {
    name: string;
    occupation: string;
    contactNo: string;
    address: string;
};

export type IStudent = {
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
    guardian: Guardian;
    localGuardian: LocalGuardian;
    profileImage?: string;
    academicSemester: Types.ObjectId | IAcademicSemester;
    academicDepartment: Types.ObjectId | IAcademicDepartment;
    academicFaculty: Types.ObjectId | IAcademicFaculty;
};

export type StudentModel = Model<IStudent, object>;

export type IStudentFilters = {
    searchTerm?: string;
    id?: string;
    bloodGroup?: string;
    email?: string;
    contactNo?: string;
    emergencyContactNo?: string;
};
