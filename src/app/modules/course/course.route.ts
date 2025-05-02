import express from 'express';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.route('/').get(CourseControllers.getAllCourses);
router.route('/:id').get(CourseControllers.getSingleCourse);

router.route('/').post(CourseControllers.createCourse);

router.route('/:id').patch(CourseControllers.updateCourse);
router.route('/:ids').delete(CourseControllers.deleteCourse);

router.route(`/:id/assigned-faculties`).post(CourseControllers.assignFaculties);
router.route('/:id/remove-faculties').delete(CourseControllers.removeFaculties);

// EXPORT ROUTERS
export const CourseRoutes = router;
