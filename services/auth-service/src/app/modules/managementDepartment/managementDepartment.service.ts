import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
    IManagementDepartment,
    IManagementDepartmentFilters,
} from './managementDepartment.interface';
import { ManagementDepartment } from './managementDepartment.model';
import { managementDepartmentSearchableFields } from './managementDepartment.constant';

const createManagementDepartment = async (
    payload: IManagementDepartment,
): Promise<IManagementDepartment | null> => {
    const result = await ManagementDepartment.create(payload);
    return result;
};

const getSingleManagementDepartment = async (
    id: string,
): Promise<IManagementDepartment | null> => {
    const result = await ManagementDepartment.findById(id);
    return result;
};

const getAllManagementDepartments = async (
    filters: IManagementDepartmentFilters,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IManagementDepartment[]>> => {
    const { searchTerm, ...filtersData } = filters;

    // search and filters condition
    const andConditions = [];

    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: managementDepartmentSearchableFields.map((field) => ({
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

    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);

    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    const result = await ManagementDepartment.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);

    //
    const total = await ManagementDepartment.countDocuments(whereCondition);

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
};

const updateManagementDepartment = async (
    id: string,
    payload: Partial<IManagementDepartment>,
): Promise<IManagementDepartment | null> => {
    const result = await ManagementDepartment.findOneAndUpdate(
        { _id: id },
        payload,
        { new: true },
    );
    return result;
};

const deleteManagementDepartment = async (
    id: string,
): Promise<IManagementDepartment | null> => {
    const result = await ManagementDepartment.findByIdAndDelete(id);
    return result;
};

export const ManagementDepartmentService = {
    createManagementDepartment,
    getAllManagementDepartments,
    getSingleManagementDepartment,
    updateManagementDepartment,
    deleteManagementDepartment,
};
