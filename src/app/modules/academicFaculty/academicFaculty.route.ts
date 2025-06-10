import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router
    .route('/')
    .post(
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        validateRequest(
            AcademicFacultyValidation.createAcademicFacultyZodSchema,
        ),
        AcademicFacultyController.createAcademicFaculty,
    )
    .get(
        auth(
            ENUM_USER_ROLE.SUPER_ADMIN,
            ENUM_USER_ROLE.ADMIN,
            ENUM_USER_ROLE.FACULTY,
            ENUM_USER_ROLE.STUDENT,
        ),
        AcademicFacultyController.getAllAcademicFaculties,
    );

router
    .route('/:id')
    .get(
        auth(
            ENUM_USER_ROLE.SUPER_ADMIN,
            ENUM_USER_ROLE.ADMIN,
            ENUM_USER_ROLE.FACULTY,
            ENUM_USER_ROLE.STUDENT,
        ),
        AcademicFacultyController.getSingleAcademicFaculty,
    )
    .patch(
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        validateRequest(
            AcademicFacultyValidation.updateAcademicFacultyZodSchema,
        ),
        AcademicFacultyController.updateAcademicFaculty,
    )
    .delete(
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        AcademicFacultyController.deleteAcademicFaculty,
    );

export const AcademicFacultyRoutes = router;
