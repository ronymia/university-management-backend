import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

// Student self-service routes
router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMyRegistration
);

router.get(
  '/get-my-semester-courses',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.getMySemesterRegCourses
);

router.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.startMyRegistration
);

router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);

// Enrollment routes
router.post(
  '/enrolled-into-semester',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  SemesterRegistrationController.enrollIntoSemesterRegistration
);

router.post(
  '/enrolled-into-course',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  validateRequest(
    SemesterRegistrationValidation.enrolledOrWithdrawCourseZodSchema
  ),
  SemesterRegistrationController.enrollIntoCourse
);

router.post(
  '/withdraw-from-enrolled-course',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  validateRequest(
    SemesterRegistrationValidation.enrolledOrWithdrawCourseZodSchema
  ),
  SemesterRegistrationController.withdrawFromEnrolledCourse
);

// Admin routes
router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(SemesterRegistrationValidation.createZodSchema),
  SemesterRegistrationController.createSemesterRegistration
);

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT
  ),
  SemesterRegistrationController.getAllSemesterRegistration
);

router.post(
  '/:id/start-new-semester',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SemesterRegistrationController.startNewSemester
);

router
  .route('/:id')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY,
      ENUM_USER_ROLE.STUDENT
    ),
    SemesterRegistrationController.getSingleSemesterRegistration
  )
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(SemesterRegistrationValidation.updateZodSchema),
    SemesterRegistrationController.updateSemesterRegistration
  )
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    SemesterRegistrationController.deleteSemesterRegistration
  );

// EXPORT
export const SemesterRegistrationRoutes = router;
