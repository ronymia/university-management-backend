import { Schema, model } from 'mongoose';
import {
    AcademicDepartmentModel,
    IAcademicDepartment,
} from './academicDepartment.interface';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<
    IAcademicDepartment,
    AcademicDepartmentModel
>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'academicFaculty',
            required: false,
        },
        syncId: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

academicDepartmentSchema.pre('save', async function () {
    const existAcademicDepartment = await AcademicDepartment.findOne({
        title: this.title,
    });
    if (existAcademicDepartment) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Department already exists',
        );
    }
});

export const AcademicDepartment = model<
    IAcademicDepartment,
    AcademicDepartmentModel
>('academicDepartment', academicDepartmentSchema, 'academic_departments');
