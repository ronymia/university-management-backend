import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { academicDepartmentSearchableFields } from './academicDepartment.constant';
import {
    IAcademicDepartment,
    IAcademicDepartmentCreateFromEvent,
    IAcademicDepartmentFilters,
} from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';

// CREATE ACADEMIC DEPARTMENT
const createAcademicDepartment = async (
    payload: IAcademicDepartment,
): Promise<IAcademicDepartment | null> => {
    const result = (await AcademicDepartment.create(payload)).populate(
        'academicFaculty',
    );
    return result;
};

// GET SINGLE ACADEMIC DEPARTMENT
const getSingleAcademicDepartment = async (
    id: string,
): Promise<IAcademicDepartment | null> => {
    const result =
        await AcademicDepartment.findById(id).populate('academicFaculty');
    return result;
};

// GET ALL ACADEMIC DEPARTMENT
const getAllAcademicDepartments = async (
    filters: IAcademicDepartmentFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAcademicDepartment[]>> => {
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    // Extract searchTerm to implement search query
    const { searchTerm, ...filtersData } = filters;

    // search and filters condition
    const andConditions = [];

    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: academicDepartmentSearchableFields.map((field) => ({
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

    // Dynamic  Sort needs  field to  do sorting
    const sortCondition: { [keyof: string]: SortOrder } = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }

    // If there is no condition , put {} to give all data
    const whereCondition = andConditions.length ? { $and: andConditions } : {};

    // query in database
    const result = await AcademicDepartment.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    // Getting total
    const total = await AcademicDepartment.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

// UPDATE ACADEMIC DEPARTMENT
const updateAcademicDepartment = async (
    id: string,
    payload: Partial<IAcademicDepartment>,
): Promise<IAcademicDepartment | null> => {
    const result = await AcademicDepartment.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true },
    ).populate('academicFaculty');
    return result;
};

// DELETE ACADEMIC DEPARTMENT
const deleteAcademicDepartment = async (
    id: string,
): Promise<IAcademicDepartment | null> => {
    const result = await AcademicDepartment.findByIdAndDelete(id);
    return result;
};

// CREATE ACADEMIC DEPARTMENT FROM EVENT
const createAcademicDepartmentFromEvent = async (
    event: IAcademicDepartmentCreateFromEvent,
): Promise<void> => {
    const getFaculty = await AcademicFaculty.findOne({
        syncId: event.academicFacultyId,
    });

    await AcademicDepartment.create({
        title: event.title,
        academicFaculty: getFaculty?._id,
        syncId: event.syncId,
    });
};

// UPDATE ACADEMIC DEPARTMENT FROM EVENT
const updateAcademicDepartmentFromEvent = async (
    event: IAcademicDepartmentCreateFromEvent,
): Promise<void> => {
    const getFaculty = await AcademicFaculty.findOne({
        syncId: event.academicFacultyId,
    });
    const getDepartment = await AcademicDepartment.findOne({
        syncId: event.syncId,
    });

    if (!getDepartment) {
        await AcademicDepartment.create({
            title: event.title,
            academicFaculty: getFaculty?._id,
            syncId: event.syncId,
        });
    }

    await AcademicDepartment.findOneAndUpdate(
        { syncId: event.syncId },
        {
            $set: {
                title: event.title,
                academicFaculty: getFaculty?._id,
            },
        },
        {
            new: true,
        },
    );
};

// DELETE ACADEMIC DEPARTMENT FROM EVENT
const deleteAcademicDepartmentFromEvent = async (syncId: string) => {
    await AcademicDepartment.findOneAndDelete({ syncId: syncId });
};

// EXPORT SERVICES
export const AcademicDepartmentService = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    getSingleAcademicDepartment,
    updateAcademicDepartment,
    deleteAcademicDepartment,
    createAcademicDepartmentFromEvent,
    updateAcademicDepartmentFromEvent,
    deleteAcademicDepartmentFromEvent,
};
