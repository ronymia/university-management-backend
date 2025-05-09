import { model, Schema } from 'mongoose';
import { bloodGroup, gender } from './student.constant';
import { IStudent, StudentModel } from './student.interface';

const studentSchema = new Schema<IStudent, StudentModel>(
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
        gender: {
            type: String,
            enum: gender,
            required: false,
        },
        dateOfBirth: {
            type: String,
            // required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        bloodGroup: {
            type: String,
            enum: bloodGroup,
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
        presentAddress: {
            type: String,
            required: true,
        },
        permanentAddress: {
            type: String,
            required: true,
        },
        guardian: {
            required: true,
            type: {
                fatherName: {
                    type: String,
                    required: true,
                },
                fatherOccupation: {
                    type: String,
                    required: true,
                },
                fatherContactNo: {
                    type: String,
                    required: true,
                },
                motherName: {
                    type: String,
                    required: true,
                },
                motherOccupation: {
                    type: String,
                    required: true,
                },
                motherContactNo: {
                    type: String,
                    required: true,
                },
                address: {
                    type: String,
                    required: true,
                },
            },
        },
        localGuardian: {
            required: true,
            type: {
                name: {
                    type: String,
                    required: true,
                },
                occupation: {
                    type: String,
                    required: true,
                },
                contactNo: {
                    type: String,
                    required: true,
                },
                address: {
                    type: String,
                    required: true,
                },
            },
        },
        profileImage: {
            type: String,
            required: false,
        },
        academicSemester: {
            type: Schema.Types.ObjectId,
            ref: 'academicSemester',
            required: true,
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

export const Student = model<IStudent, StudentModel>('Student', studentSchema);
