import express from 'express';

import { OfferedCourseControllers } from './offeredCourse.controller';

const router = express.Router();

router.route('/').get(OfferedCourseControllers.getAllOfferedCourses);
router.route('/:id').get(OfferedCourseControllers.getSingleOfferedCourse);

router
  .route('/:id')
  .patch(OfferedCourseControllers.updateOfferedCourse)
  .delete(OfferedCourseControllers.deleteOfferedCourse);

// EXPORT ROUTERS
export const OfferedCourseRoutes = router;
