import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterZodSchema } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get('/', AcademicSemesterController.getAllAcademicSemesters);

router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(AcademicSemesterZodSchema.createAcademicSemesterZodSchema),
  AcademicSemesterController.createAcademicSemester
);

// router.patch(
//   '/:id',
//   validateRequest(AcademicSemesterZodSchema.updateAcademicSemesterZodSchema),
//   AcademicSemesterController.updateAcademicSemester
// );

// router.delete('/:id', AcademicSemesterController.deleteAcademicSemester);

export const AcademicSemesterRoutes = router;
