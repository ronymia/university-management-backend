import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/my-courses', StudentControllers.myCourses);

router.get('/my-semester-reg-courses', StudentControllers.mySemesterRegCourses);
router.get('/my-course-schedules', StudentControllers.myCourseSchedules);
router.get('/my-academic-info', StudentControllers.myAcademicInfo);
router.route('/').get(StudentControllers.getAllStudents);
router.route('/:id').get(StudentControllers.getSingleStudent);

router
  .route('/:id')
  .patch(StudentControllers.updateStudent)
  .delete(StudentControllers.deleteStudent);

// EXPORT ROUTERS
export const StudentRoutes = router;
