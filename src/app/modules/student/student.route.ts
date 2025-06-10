import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
    '/:id',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    StudentController.getSingleStudent,
);
router.patch(
    '/:id',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    validateRequest(StudentValidation.updateStudentZodSchema),
    StudentController.updateStudent,
);
router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    StudentController.deleteStudent,
);

router.get(
    '/',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    StudentController.getAllStudents,
);

export const StudentRoutes = router;
