import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { StudentSemesterRegistrationController } from './studentSemesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentSemesterRegistrationValidation } from './studentSemesterRegistration.validation';

const router = express.Router();

router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(
      StudentSemesterRegistrationValidation.updateStudentSemesterRegistrationZodSchema
    ),
    StudentSemesterRegistrationController.updatedStudentSemesterRegistration
  )
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    StudentSemesterRegistrationController.deleteStudentSemesterRegistration
  );

export const StudentSemesterRegistrationRoutes = router;
