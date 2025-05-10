import { Schema, model } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import {
    AcademicFacultyModel,
    IAcademicFaculty,
} from './academicFaculty.interface';
import httpStatus from 'http-status';

const academicFacultySchema = new Schema<
    IAcademicFaculty,
    AcademicFacultyModel
>(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        syncId: {
            type: String,
            required: true,
            unique: true,
        },
    },

    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

academicFacultySchema.pre('save', async function (next) {
    const existAcademicFaculty = await AcademicFaculty.findOne({
        title: this.title,
    });
    if (existAcademicFaculty) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Faculty already exists',
        );
    }

    next();
});

export const AcademicFaculty = model<IAcademicFaculty, AcademicFacultyModel>(
    'academicFaculty',
    academicFacultySchema,
    'academic_faculties',
);
