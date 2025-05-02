import express from 'express';
import { StudentEnrolledCourseControllers } from './studentEnrolledCourse.controller';

const router = express.Router();

router.route('/').get(StudentEnrolledCourseControllers.getAllStudentEnrolledCourses);
router.route('/:id').get(StudentEnrolledCourseControllers.getSingleStudentEnrolledCourse);

router.route('/').post(StudentEnrolledCourseControllers.createStudentEnrolledCourse);

router
  .route('/:id')
  .patch(StudentEnrolledCourseControllers.updateStudentEnrolledCourse)
  .delete(StudentEnrolledCourseControllers.deleteStudentEnrolledCourse);

// EXPORT ROUTERS
export const StudentEnrolledCourseRoutes = router;
