import express from 'express';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

// Student
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

// Faculty
router.post(
    '/create-faculty',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    // validateRequest(UserValidation.createFacultyZodSchema),
    UserController.createFaculty,
);

router.post(
    '/create-admin',
    auth(ENUM_USER_ROLE.SUPER_ADMIN),
    // validateRequest(UserValidation.createAdminZodSchema),
    UserController.createAdmin,
);

export const UserRoutes = router;
