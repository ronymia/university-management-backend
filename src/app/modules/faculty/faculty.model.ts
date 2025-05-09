import { model, Schema } from 'mongoose';
import { FacultyModel, IFaculty } from './faculty.interface';
import { bloodGroup, designation, gender } from './faculty.constant';

const facultySchema = new Schema<IFaculty, FacultyModel>(
    {
        id: {
            type: String,
            required: false,
            unique: true,
        },
        name: {
            required: true,
            type: {
                firstName: {
                    type: String,
                    required: true,
                },
                middleName: {
                    type: String,
                    required: false,
                },
                lastName: {
                    type: String,
                    required: true,
                },
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        contactNo: {
            type: String,
            required: true,
            unique: true,
        },
        emergencyContactNo: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: gender,
            required: false,
        },
        dateOfBirth: {
            type: String,
            // required: true,
        },
        bloodGroup: {
            type: String,
            enum: bloodGroup,
        },
        presentAddress: {
            type: String,
            required: true,
        },
        permanentAddress: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
            enum: designation,
        },
        profileImage: {
            type: String,
            required: false,
        },
        academicDepartment: {
            type: Schema.Types.ObjectId,
            ref: 'academicDepartment',
            required: true,
        },
        academicFaculty: {
            type: Schema.Types.ObjectId,
            ref: 'academicFaculty',
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

export const Faculty = model<IFaculty, FacultyModel>('Faculty', facultySchema);
