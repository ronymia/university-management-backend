import { Schema, model } from 'mongoose';
import {
    IAcademicSemester,
    AcademicSemesterModel,
} from './academicSemester.interface';
import {
    academicSemesterMonths,
    academicSemesterTitles,
    academicSemesterCodes,
} from './academicSemester.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<IAcademicSemester>(
    {
        title: {
            type: String,
            required: true,
            enum: academicSemesterTitles,
        },
        year: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            enum: academicSemesterCodes,
        },
        startMonth: {
            type: String,
            required: true,
            enum: academicSemesterMonths,
        },
        endMonth: {
            type: String,
            required: true,
            enum: academicSemesterMonths,
        },
        syncId: {
            type: String,
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

academicSemesterSchema.pre('save', async function () {
    const existAcademicSemester = await AcademicSemester.findOne({
        title: this.title,
        year: this.year,
    });
    if (existAcademicSemester) {
        throw new ApiError(
            httpStatus.CONFLICT,
            'Academic Semester already exists',
        );
    }
});

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
    'Academic_Semester',
    academicSemesterSchema,
);
