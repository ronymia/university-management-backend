import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidations } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.route('/').get(AcademicSemesterController.getAllAcademicSemesters);

router.route('/:id').get(AcademicSemesterController.getSingleAcademicSemester);

router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicSemesterValidations.createZodSchema),
    AcademicSemesterController.createAcademicSemester
  );

router
  .route('/:id')
  .patch(
    validateRequest(AcademicSemesterValidations.updateZodSchema),
    AcademicSemesterController.updateAcademicSemester
  );

router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicSemesterController.deleteAcademicSemester
  );

// EXPORT ROUTES
export const AcademicSemesterRoutes = router;
