import mongoose, { SortOrder } from 'mongoose';
import config from '../../../config/index';
import ApiError from '../../../errors/ApiError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser, IUserFilterRequest } from './user.interface';
import { User } from './user.model';
import {
    generateAdminId,
    generateFacultyId,
    generateStudentId,
} from './user.utils';
import { Student } from '../student/student.model';
import { IFaculty } from '../faculty/faculty.interface';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { Faculty } from '../faculty/faculty.model';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import httpStatus from 'http-status';
import { RedisClient } from '../../../shared/redis';
import {
    EVENT_ADMIN_CREATED,
    EVENT_FACULTY_CREATED,
    EVENT_STUDENT_CREATED,
    userSearchableFields,
} from './user.constant';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';

// Create Student
const createStudent = async (
    student: IStudent,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.STUDENT;

    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_student_pass as string;
    }

    // GET ACADEMIC SEMESTER
    const academicSemester = await AcademicSemester.findById(
        student.academicSemester,
    ).lean();

    let newUserData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        // AUTO GENERATED INCREMENTAL STUDENT ID
        const studentId = await generateStudentId(academicSemester);
        user.id = studentId;
        student.id = studentId;

        //  CREATING STUDENT USING SESSION
        const newStudent = await Student.create([student], { session });
        if (!newStudent.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create student',
            );
        }

        //  SET STUDENT _id (reference) TO user.student
        user.student = newStudent[0]._id;

        //  CREATING USER
        const newUser = await User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create student',
            );
        }

        newUserData = newUser[0];
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserData) {
        newUserData = await User.findOne({ id: newUserData.id }).populate({
            path: 'student',
            populate: [
                {
                    path: 'academicSemester',
                },
                {
                    path: 'academicDepartment',
                },
                {
                    path: 'academicFaculty',
                },
            ],
        });
    }

    // PUBLISH ON REDIS
    if (newUserData) {
        await RedisClient.publish(
            EVENT_STUDENT_CREATED,
            JSON.stringify(newUserData.student),
        );
    }

    return newUserData;
};

// Create Faculty
const createFaculty = async (
    faculty: IFaculty,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.FACULTY;

    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_faculty_pass as string;
    }

    let newUserData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // AUTO GENERATED INCREMENTAL FACULTY ID
        const facultyId = await generateFacultyId();
        user.id = facultyId;
        faculty.id = facultyId;

        //  CREATING FACULTY
        const newFaculty = await Faculty.create([faculty], { session });
        if (!newFaculty.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create faculty',
            );
        }

        //  SET Faculty _id (reference) TO user.faculty
        user.faculty = newFaculty[0]._id;

        //  CREATING USER
        const newUser = await User.create([user], { session });
        if (!newUser.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create faculty',
            );
        }

        newUserData = newUser[0];
        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserData) {
        newUserData = await User.findOne({ id: newUserData.id }).populate({
            path: 'faculty',
            populate: [
                {
                    path: 'academicDepartment',
                },
                {
                    path: 'academicFaculty',
                },
            ],
        });
    }

    // PUBLISH ON REDIS
    if (newUserData) {
        await RedisClient.publish(
            EVENT_FACULTY_CREATED,
            JSON.stringify(newUserData.faculty),
        );
    }

    return newUserData;
};

// Create Admin
const createAdmin = async (
    admin: IAdmin,
    user: IUser,
): Promise<IUser | null> => {
    // SET ROLE
    user.role = ENUM_USER_ROLE.ADMIN;

    // IF PASSWORD IS NOT GIVEN, SET DEFAULT PASSWORD
    if (!user.password) {
        user.password = config.default_admin_pass as string;
    }

    // generate faculty id
    let newUserAllData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // AUTO GENERATED INCREMENTAL ADMIN ID
        const adminId = await generateAdminId();
        user.id = adminId;
        admin.id = adminId;

        //  CREATING ADMIN USING SESSION
        const newAdmin = await Admin.create([admin], { session });

        if (!newAdmin.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create Admin ',
            );
        }

        //  SET ADMIN _id (reference) TO user.admin
        user.admin = newAdmin[0]._id;

        //  CREATING USER
        const newUser = await User.create([user], { session });

        if (!newUser.length) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                'Failed to create admin',
            );
        }
        newUserAllData = newUser[0];

        await session.commitTransaction();
        await session.endSession();
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

    if (newUserAllData) {
        newUserAllData = await User.findOne({ id: newUserAllData.id }).populate(
            {
                path: 'admin',
                populate: [
                    {
                        path: 'managementDepartment',
                    },
                ],
            },
        );
    }

    // PUBLISH ON REDIS
    if (newUserAllData) {
        await RedisClient.publish(
            EVENT_ADMIN_CREATED,
            JSON.stringify(newUserAllData.admin),
        );
    }

    return newUserAllData;
};

// GET ALL USERS
const getAllUsers = async (
    filters: IUserFilterRequest,
    paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IUser[]>> => {
    const { searchTerm, ...filtersData } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(paginationOptions);
    // search and filters condition
    const andConditions = [];

    // ❌ Always exclude SUPER_ADMIN
    andConditions.push({
        role: { $ne: ENUM_USER_ROLE.SUPER_ADMIN },
    });

    // search condition $or
    if (searchTerm) {
        andConditions.push({
            $or: userSearchableFields.map((field) => ({
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

    const sortCondition: { [keyof: string]: SortOrder } = {};

    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }

    // QUERY
    const result = await User.find(whereCondition)
        .populate('admin')
        .populate('faculty')
        .populate('student');

    // RETURNING RESPONSE
    return {
        meta: {
            page,
            limit,
            total: result.length,
        },
        data: result,
    };
};

// GET SINGLE USER
const getSingleUser = async (id: string): Promise<IUser | null> => {
    const result = await User.findOne({ id: id })
        .populate('admin')
        .populate('faculty')
        .populate('student');
    return result;
};

// UPDATE USER
const updateUser = async (
    id: string,
    payload: Partial<IUser>,
): Promise<IUser | IAdmin | IFaculty | IStudent | null> => {
    // GET USER
    const getUser = await User.findOne({ id: id });
    // CHECK USER
    if (!getUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // UPDATE SUPER ADMIN
    if (getUser.role === ENUM_USER_ROLE.SUPER_ADMIN) {
        //
        return getUser;
    } else if (getUser.role === ENUM_USER_ROLE.ADMIN) {
        // UPDATE ADMIN
        const result = await Admin.findOneAndUpdate(
            { id: getUser.id },
            payload,
            {
                new: true,
            },
        ).populate('admin');
        return result;
    } else if (getUser.role === ENUM_USER_ROLE.FACULTY) {
        // UPDATE FACULTY
        const result = await Faculty.findOneAndUpdate(
            { id: getUser.id },
            payload,
            {
                new: true,
            },
        ).populate('faculty');
        return result;
    } else if (getUser.role === ENUM_USER_ROLE.STUDENT) {
        // UPDATE STUDENT
        const result = await Student.findOneAndUpdate(
            { id: getUser.id },
            payload,
            {
                new: true,
            },
        ).populate('student');
        return result;
    }
    return null;
};

// DELETE USER
const deleteUser = async (id: string): Promise<IUser | null> => {
    // Get the user
    const user = await User.findOne({ id })
        .populate('admin')
        .populate('faculty')
        .populate('student');

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Delete related role data
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        if (user.admin) {
            await Admin.findByIdAndDelete(user.admin.id, { session });
        }

        if (user.faculty) {
            await Faculty.findByIdAndDelete(user.faculty.id, { session });
        }

        if (user.student) {
            await Student.findByIdAndDelete(user.student.id, { session });
        }

        // Delete the user itself
        const deletedUser = await User.findByIdAndDelete(user._id, { session });

        await session.commitTransaction();
        return deletedUser;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

// EXPORT USER SERVICES
export const UserService = {
    createStudent,
    createFaculty,
    createAdmin,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
