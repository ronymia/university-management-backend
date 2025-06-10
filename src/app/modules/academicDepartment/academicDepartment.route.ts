import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router
    .route('/')
    .post(
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        validateRequest(
            AcademicDepartmentValidation.createAcademicDepartmentZodSchema,
        ),
        AcademicDepartmentController.createAcademicDepartment,
    )
    .get(
        auth(
            ENUM_USER_ROLE.SUPER_ADMIN,
            ENUM_USER_ROLE.ADMIN,
            ENUM_USER_ROLE.FACULTY,
            ENUM_USER_ROLE.STUDENT,
        ),
        AcademicDepartmentController.getAllAcademicDepartments,
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
        AcademicDepartmentController.getSingleAcademicDepartment,
    )
    .patch(
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        validateRequest(
            AcademicDepartmentValidation.updateAcademicDepartmentZodSchema,
        ),
        AcademicDepartmentController.updateAcademicDepartment,
    )
    .delete(
        auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
        AcademicDepartmentController.deleteAcademicDepartment,
    );

export const AcademicDepartmentRoutes = router;
