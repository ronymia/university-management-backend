import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicFacultySearchableFields } from './academicFaculty.constant';
import {
    IAcademicFaculty,
    IAcademicFacultyFilters,
} from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFaculty = async (
    payload: IAcademicFaculty,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.create(payload);
    return result;
};

const getSingleAcademicFaculty = async (
    id: string,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.findById(id);
    return result;
};

const getAllAcademicFaculties = async (
    filters: IAcademicFacultyFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicFaculty[]>> => {
    // Extract searchTerm to implement search query
    const { searchTerm, ...filtersData } = filters;

    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    // search and filters condition
    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: academicFacultySearchableFields.map((field) => ({
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

    // Filters needs $and to full fill all the conditions
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }

    // Dynamic sort needs  fields to  do sorting
    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }

    // If there is no condition , put {} to give all data
    const whereCondition = andConditions.length ? { $and: andConditions } : {};

    //database
    const result = await AcademicFaculty.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await AcademicFaculty.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const updateAcademicFaculty = async (
    id: string,
    payload: Partial<IAcademicFaculty>,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.findOneAndUpdate(
        { _id: id },
        payload,
        {
            new: true,
        },
    );
    return result;
};

const deleteAcademicFaculty = async (
    id: string,
): Promise<IAcademicFaculty | null> => {
    const result = await AcademicFaculty.findByIdAndDelete(id);
    return result;
};

// CREATE ACADEMIC FACULTY FROM EVENT
const createAcademicFacultyFromEvent = async (event: IAcademicFaculty) => {
    await AcademicFaculty.create(event);
};

// UPDATE ACADEMIC FACULTY FROM EVENT
const updateAcademicFacultyFromEvent = async (event: IAcademicFaculty) => {
    await AcademicFaculty.findOneAndUpdate(
        { syncId: event.syncId },
        {
            $set: {
                title: event.title,
                syncId: event.syncId,
            },
        },
        {
            new: true,
        },
    );
};

// DELETE ACADEMIC FACULTY FROM EVENT
const deleteAcademicFacultyFromEvent = async (syncId: string) => {
    await AcademicFaculty.findOneAndDelete({ syncId: syncId });
};

// EXPORT SERVICES
export const AcademicFacultyService = {
    createAcademicFaculty,
    getAllAcademicFaculties,
    getSingleAcademicFaculty,
    updateAcademicFaculty,
    deleteAcademicFaculty,
    createAcademicFacultyFromEvent,
    updateAcademicFacultyFromEvent,
    deleteAcademicFacultyFromEvent,
};
