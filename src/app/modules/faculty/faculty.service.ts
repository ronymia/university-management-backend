/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { Faculty } from './faculty.model';
import { IFaculty, IFacultyFilters } from './faculty.interface';
import {
    EVENT_FACULTY_DELETED,
    EVENT_FACULTY_UPDATED,
    facultySearchableFields,
} from './faculty.constant';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { Outbox } from '../outbox/outbox.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Types } from 'mongoose';

const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
    const result = await Faculty.findOne({ id })
        .populate('academicDepartment')
        .populate('academicFaculty');
    return result;
};

const getAllFaculties = async (
    filters: IFacultyFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IFaculty[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andConditions = [];

    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: facultySearchableFields.map((field) => ({
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
    const result = await Faculty.find(whereCondition)
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await Faculty.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const updateFaculty = async (
    id: string,
    payload: Partial<IFaculty>,
): Promise<IFaculty | null> => {
    //
    const { name, academicFaculty, academicDepartment, ...faculty } = payload;
    //
    const isExist = await Faculty.findOne({ id });
    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
    }

    // Create a new object to hold the update data
    const facultyData: Partial<IFaculty> & Record<string, any> = { ...faculty };

    // Resolve syncIds to actual MongoDB _ids
    let resolvedFacultyId = isExist.academicFaculty;
    let resolvedDepartmentId = isExist.academicDepartment;

    if (academicFaculty) {
        const facultyDoc = await AcademicFaculty.findOne({
            syncId: academicFaculty,
        });
        if (facultyDoc) {
            facultyData.academicFaculty = facultyDoc._id;
            resolvedFacultyId = facultyDoc._id as Types.ObjectId;
        }
    }
    if (academicDepartment) {
        const departmentDoc = await AcademicDepartment.findOne({
            syncId: academicDepartment,
        });
        if (departmentDoc) {
            facultyData.academicDepartment = departmentDoc._id;
            resolvedDepartmentId = departmentDoc._id as Types.ObjectId;
        }
    }

    // CHECK ACADEMIC DEPARTMENT
    if (academicFaculty || academicDepartment) {
        const getAcademicDepartment = await AcademicDepartment.findOne({
            _id: resolvedDepartmentId,
            academicFaculty: resolvedFacultyId,
        });
        if (!getAcademicDepartment) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                'Academic department not found for this faculty',
            );
        }
    }

    // Update the nested name fields
    if (name && Object.keys(name).length > 0) {
        Object.keys(name).forEach((key) => {
            facultyData[`name.${key}`] = name[key as keyof typeof name];
        });
    }

    // Update the faculty document
    const result = await Faculty.findOneAndUpdate({ id }, facultyData, {
        new: true,
    })
        .populate('academicDepartment')
        .populate('academicFaculty');

    // PUBLISH ON OUTBOX
    if (result) {
        await Outbox.create([
            {
                eventType: EVENT_FACULTY_UPDATED,
                payload: JSON.stringify(result),
            },
        ]);
    }

    return result;
};

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
    const isExist = Faculty.findOne({ id });

    if (!isExist) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        // delete faculty first
        const faculty = await Faculty.findByIdAndDelete({ id }, { session });

        if (!faculty) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                'Failed to delete faculty',
            );
        }
        //delete user
        await User.deleteOne({ id });
        // PUBLISH ON OUTBOX INSIDE TRANSACTION
        if (faculty) {
            await Outbox.create(
                [
                    {
                        eventType: EVENT_FACULTY_DELETED,
                        payload: JSON.stringify(faculty),
                    },
                ],
                { session },
            );
        }

        await session.commitTransaction();
        await session.endSession();

        return faculty;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

export const FacultyService = {
    getAllFaculties,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty,
};
