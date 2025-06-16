import express from 'express';
import { StudentEnrolledCourseMarkControllers } from './studentEnrolledCourseMark.controller';

const router = express.Router();

router.route('/').get(StudentEnrolledCourseMarkControllers.getAllStudentEnrolledCourseMarks);
router.route('/:id').get(StudentEnrolledCourseMarkControllers.getSingleStudentEnrolledCourseMark);

router
  .route('/update-marks')
  .patch(StudentEnrolledCourseMarkControllers.updateStudentEnrolledCourseMark);
router
  .route('/update-final-marks')
  .patch(StudentEnrolledCourseMarkControllers.updateStudentEnrolledCourseFinalMark);

// EXPORT ROUTERS
export const StudentEnrolledCourseMarkRoutes = router;
