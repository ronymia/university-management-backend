import { Schema, model } from 'mongoose';
import { IUser, IUserMethods, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../../config';

// And a schema that knows about IUserMethods
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'banned', 'pending'],
            default: 'pending',
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        needsChangePassword: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date,
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
        faculty: {
            type: Schema.Types.ObjectId,
            ref: 'Faculty',
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    },
);

userSchema.methods.isUserExist = async function (id: string) {
    return await User.findOne(
        { id },
        { id: 1, password: 1, needsChangePassword: 1, role: 1 },
    ).lean();
};

userSchema.methods.isPasswordMatch = async function (
    givenPassword: string,
    savedPassword: string,
) {
    return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.pre('save', async function (next) {
    // hash password
    this.password = await bcrypt.hash(
        this.password,
        Number(config.default_bcrypt_salt_rounds),
    );
    next();
});

export const User = model<IUser, UserModel>('User', userSchema);
