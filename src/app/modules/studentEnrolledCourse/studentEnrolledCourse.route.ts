import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentEnrolledCourseValidation } from './studentEnrolledCourse.validation';

const router = express.Router();

router
  .route('/')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrolledCourseController.getAllStudentEnrolledCourse
  );

router
  .route('/:id')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrolledCourseController.getSingleStudentEnrolledCourse
  );
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    validateRequest(
      studentEnrolledCourseValidation.updateStudentEnrolledCourseSchema
    ),
    StudentEnrolledCourseController.updateStudentEnrolledCourse
  );
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrolledCourseController.deleteStudentEnrolledCourse
  );

// EXPORT
export const StudentEnrolledCourseRoutes = router;
