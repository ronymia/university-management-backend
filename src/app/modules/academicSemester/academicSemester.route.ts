import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterZodSchema } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicSemesterZodSchema.createAcademicSemesterZodSchema),
  AcademicSemesterController.createAcademicSemester
);

router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);
// router.patch(
//   '/:id',
//   validateRequest(AcademicSemesterZodSchema.updateAcademicSemesterZodSchema),
//   AcademicSemesterController.updateAcademicSemester
// );
// router.delete('/:id', AcademicSemesterController.deleteAcademicSemester);

router.get('/', AcademicSemesterController.getAllAcademicSemesters);

export const AcademicSemesterRoutes = router;
