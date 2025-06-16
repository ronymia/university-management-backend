import express from 'express';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

router.route('/').get(FacultyControllers.getAllFaculties);
router.route('/my-courses').get(FacultyControllers.myCourses);
router.get('/my-course-students', FacultyControllers.getMyCourseStudents);
router.route('/core-faculties').get(FacultyControllers.getAllFacultiesFromCore);
router.route('/:id').get(FacultyControllers.getSingleFaculty);

router
  .route('/:id')
  .patch(FacultyControllers.updateFaculty)
  .delete(FacultyControllers.deleteFaculty);

// EXPORT ROUTERS
export const FacultyRoutes = router;
