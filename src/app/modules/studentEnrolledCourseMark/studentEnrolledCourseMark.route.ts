import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import { StudentEnrolledCourseMarkValidation } from './studentEnrolledCourseMark.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router
  .route('/')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMark
  );
router
  .route('/:id')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    StudentEnrolledCourseMarkController.getSingleStudentEnrolledCourseMark
  );
router
  .route('/update-marks')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
    validateRequest(
      StudentEnrolledCourseMarkValidation.updateStudentEnrolledCourseMarkZodSchema
    ),
    StudentEnrolledCourseMarkController.updateStudentEnrolledCourseMark
  );

router.route('/update-final-marks').patch(
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.FACULTY),
  // validateRequest(
  //   StudentEnrolledCourseMarkValidation.updateStudentEnrolledCourseMarkZodSchema
  // ),
  StudentEnrolledCourseMarkController.updateStudentFinalMark
);

export const StudentEnrolledCourseMarkRoutes = router;
