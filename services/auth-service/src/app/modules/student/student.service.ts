/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IStudent, IStudentFilters } from './student.interface';
import { Student } from './student.model';
import {
    EVENT_STUDENT_DELETED,
    EVENT_STUDENT_UPDATED,
    studentSearchableFields,
} from './student.constant';
import { User } from '../user/user.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import httpStatus from 'http-status';
import { RedisClient } from '../../../shared/redis';
import { Outbox } from '../outbox/outbox.model';

// GET SINGLE STUDENT
const getSingleStudent = async (id: string): Promise<IStudent | null> => {
    const result = await Student.findOne({ id })
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty');
    return result;
};

// GET ALL STUDENTS
const getAllStudents = async (
    filters: IStudentFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IStudent[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andConditions = [];

    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: studentSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // filters condition $and
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const whereCondition = andConditions.length ? { $and: andConditions } : {};

    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const result = await Student.find(whereCondition)
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await Student.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

// UPDATE STUDENT
const updateStudent = async (
    id: string,
    payload: Partial<IStudent>,
): Promise<IStudent | null> => {
    const isExist = await Student.findOne({ id });
    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
    }

    const {
        name,
        guardian,
        localGuardian,
        academicSemester,
        academicFaculty,
        academicDepartment,
        ...student
    } = payload;

    // Create a new object to hold the update data
    const studentData: Partial<IStudent> & Record<string, any> = { ...student };

    // Resolve syncIds to actual MongoDB _ids
    if (academicSemester) {
        const semester = await AcademicSemester.findOne({
            syncId: academicSemester,
        });
        if (semester) studentData.academicSemester = semester._id;
    }
    if (academicFaculty) {
        const faculty = await AcademicFaculty.findOne({
            syncId: academicFaculty,
        });
        if (faculty) studentData.academicFaculty = faculty._id;
    }
    if (academicDepartment) {
        const department = await AcademicDepartment.findOne({
            syncId: academicDepartment,
        });
        if (department) studentData.academicDepartment = department._id;
    }

    // Update the nested name fields
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            studentData[`name.${key}`] = name[key as keyof typeof name];
        });
    }

    // Update the nested guardian fields
    if (guardian && Object.keys(guardian).length > 0) {
        Object.keys(guardian).forEach((key) => {
            studentData[`guardian.${key}`] =
                guardian[key as keyof typeof guardian];
        });
    }

    // Update the nested localGuardian fields
    if (localGuardian && Object.keys(localGuardian).length > 0) {
        Object.keys(localGuardian).forEach((key) => {
            studentData[`localGuardian.${key}`] =
                localGuardian[key as keyof typeof localGuardian];
        });
    }

    // Update the student document
    const result = await Student.findOneAndUpdate({ id }, studentData, {
        new: true,
    })
        .populate('academicSemester')
        .populate('academicDepartment')
        .populate('academicFaculty');

    // PUBLISH ON OUTBOX
    if (result) {
        await Outbox.create([
            {
                eventType: EVENT_STUDENT_UPDATED,
                payload: JSON.stringify(result),
            },
        ]);
    }

    return result;
};

// DELETE STUDENT
const deleteStudent = async (id: string): Promise<IStudent | null> => {
    const isExist = Student.findOne({ id });
    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
    }
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const student = await Student.findByIdAndDelete(id)
            .populate('academicSemester')
            .populate('academicDepartment')
            .populate('academicFaculty');

        if (!student) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Fail to delete Student');
        }
        await User.deleteOne({ id });

        // PUBLISH ON OUTBOX INSIDE TRANSACTION
        if (student) {
            await Outbox.create(
                [
                    {
                        eventType: EVENT_STUDENT_DELETED,
                        payload: JSON.stringify(student),
                    },
                ],
                { session },
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return student;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

// EXPORT SERVICES
export const StudentService = {
    getAllStudents,
    getSingleStudent,
    updateStudent,
    deleteStudent,
};
