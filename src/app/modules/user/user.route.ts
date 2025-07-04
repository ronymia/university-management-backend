import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

// CREATE Student
router.post(
    '/create-student',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
    ),
    // validateRequest(UserValidation.createStudentZodSchema),
    UserController.createStudent,
);

// CREATE Faculty
router.post(
    '/create-faculty',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    // validateRequest(UserValidation.createFacultyZodSchema),
    UserController.createFaculty,
);

// CREATE ADMIN
router.post(
    '/create-admin',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    // validateRequest(UserValidation.createAdminZodSchema),
    UserController.createAdmin,
);

// GET ALL USERS
router.get('/', auth(ENUM_USER_ROLE.SUPER_ADMIN), UserController.getAllUsers);

// GET SINGLE USER
router.get(
    '/:id',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    UserController.getSingleUser,
);

// UPDATE USER
router.patch(
    '/:id',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    // validateRequest(UserValidation.updateUserZodSchema),
    UserController.updateUser,
);

// DELETE USER
router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    UserController.deleteUser,
);

export const UserRoutes = router;
