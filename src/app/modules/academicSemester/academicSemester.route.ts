import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
import { AcademicSemesterController } from './academicSemester.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
const router = express.Router();

router.post(
    '/',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
    AcademicSemesterController.createAcademicSemester,
);

router.get(
    '/:id',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    AcademicSemesterController.getSingleAcademicSemester,
);
router.patch(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicSemesterValidation.updateAcademicSemesterZodSchema),
    AcademicSemesterController.updateAcademicSemester,
);
router.delete(
    '/:id',
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicSemesterController.deleteAcademicSemester,
);

router.get(
    '/',
    auth(
        ENUM_USER_ROLE.SUPER_ADMIN,
        ENUM_USER_ROLE.ADMIN,
        ENUM_USER_ROLE.FACULTY,
        ENUM_USER_ROLE.STUDENT,
    ),
    AcademicSemesterController.getAllAcademicSemesters,
);

export const AcademicSemesterRoutes = router;
