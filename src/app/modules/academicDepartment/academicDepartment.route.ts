import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
const router = express.Router();

router
  .route('/')
  .post(
    validateRequest(
      AcademicDepartmentValidation.createAcademicDepartmentZodSchema
    ),
    AcademicDepartmentController.createAcademicDepartment
  )
  .get(AcademicDepartmentController.getAllAcademicDepartments);

router
  .route('/:id')
  .get(AcademicDepartmentController.getSingleAcademicDepartment);
// .patch(
//     validateRequest(
//         AcademicDepartmentValidation.updateAcademicDepartmentZodSchema,
//     ),
//     AcademicDepartmentController.updateAcademicDepartment,
// )
// .delete(AcademicDepartmentController.deleteAcademicDepartment);

export const AcademicDepartmentRoutes = router;
