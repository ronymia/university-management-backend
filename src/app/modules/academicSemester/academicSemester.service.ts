import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
    academicSemesterSearchableFields,
    academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import {
    IAcademicSemester,
    IAcademicSemesterFilters,
} from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import httpStatus from 'http-status';

// CREATE ACADEMIC SEMESTER
const createAcademicSemester = async (
    payload: IAcademicSemester,
): Promise<IAcademicSemester | null> => {
    if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
        throw new ApiError(
            httpStatus.UNPROCESSABLE_ENTITY,
            'Invalid academic semester code',
        );
    }
    const result = await AcademicSemester.create(payload);
    return result;
};

// GET SINGLE ACADEMIC SEMESTER
const getSingleAcademicSemester = async (
    id: string,
): Promise<IAcademicSemester | null> => {
    const result = await AcademicSemester.findById(id);
    return result;
};

// GET ALL ACADEMIC SEMESTER
const getAllAcademicSemesters = async (
    filters: IAcademicSemesterFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicSemester[]>> => {
    const { searchTerm, ...filtersData } = filters;

    // search and filters condition
    const andConditions = [];

    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: academicSemesterSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    // const andConditions = [
    //     {
    //         $or: [
    //             {
    //                 title: {
    //                     $regex: searchTerm,
    //                     $options: 'i',
    //                 },
    //             },
    //             {
    //                 code: {
    //                     $regex: searchTerm,
    //                     $options: 'i',
    //                 },
    //             },
    //             {
    //                 year: {
    //                     $regex: searchTerm,
    //                     $options: 'i',
    //                 },
    //             },
    //         ],
    //     },
    // ];

    // filters condition $and
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    const whereCondition = andConditions.length ? { $and: andConditions } : {};

    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const result = await AcademicSemester.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await AcademicSemester.countDocuments();

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

// UPDATE ACADEMIC SEMESTER
const updateAcademicSemester = async (
    id: string,
    payload: Partial<IAcademicSemester>,
): Promise<IAcademicSemester | null> => {
    if (
        payload.title &&
        payload.code &&
        academicSemesterTitleCodeMapper[payload.title] !== payload.code
    ) {
        throw new ApiError(
            httpStatus.UNPROCESSABLE_ENTITY,
            'Invalid academic semester code',
        );
    }

    const result = await AcademicSemester.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
        },
    );
    return result;
};

// DELETE ACADEMIC SEMESTER
const deleteAcademicSemester = async (
    id: string,
): Promise<IAcademicSemester | null> => {
    const result = await AcademicSemester.findByIdAndDelete(id);
    return result;
};

// CREATE ACADEMIC SEMESTER FROM EVENT
const createSemesterFromEvent = async (event: IAcademicSemester) => {
    await AcademicSemester.create(event);
};

// UPDATE ACADEMIC SEMESTER FROM EVENT
const updateAcademicSemesterFromEvent = async (event: IAcademicSemester) => {
    const getSemester = await AcademicSemester.findOne({
        syncId: event.syncId,
    });
    if (!getSemester) {
        await AcademicSemester.create(event);
    }

    await AcademicSemester.findOneAndUpdate(
        { syncId: event.syncId },
        {
            $set: {
                title: event.title,
                year: event.year,
                code: event.code,
                startMonth: event.startMonth,
                endMonth: event.endMonth,
            },
        },
        {
            new: true,
        },
    );
};

// DELETE ACADEMIC SEMESTER FROM EVENT
const deleteAcademicSemesterFromEvent = async (syncId: string) => {
    await AcademicSemester.findOneAndDelete({ syncId: syncId });
};

// EXPORT SERVICES
export const AcademicSemesterService = {
    createAcademicSemester,
    getAllAcademicSemesters,
    getSingleAcademicSemester,
    updateAcademicSemester,
    deleteAcademicSemester,
    createSemesterFromEvent,
    updateAcademicSemesterFromEvent,
    deleteAcademicSemesterFromEvent,
};
