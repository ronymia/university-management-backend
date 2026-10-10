import { Model } from 'mongoose';

export type IManagementDepartment = {
    title: string;
};

export type ManagementDepartmentModel = Model<IManagementDepartment, object>;

export type IManagementDepartmentFilterRequest = {
    searchTerm?: string;
};

export type IManagementDepartmentFilters = {
    searchTerm?: string;
};
