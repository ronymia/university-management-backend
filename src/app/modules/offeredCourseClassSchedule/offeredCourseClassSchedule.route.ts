import express from 'express';
import { OfferedCourseClassScheduleControllers } from './offeredCourseClassSchedule.controller';

const router = express.Router();

router.route('/').get(OfferedCourseClassScheduleControllers.getAllOfferedCourseClassSchedules);
router.route('/:id').get(OfferedCourseClassScheduleControllers.getSingleOfferedCourseClassSchedule);

router
  .route('/:id')
  .patch(OfferedCourseClassScheduleControllers.updateOfferedCourseClassSchedule)
  .delete(OfferedCourseClassScheduleControllers.deleteOfferedCourseClassSchedule);

// EXPORT ROUTERS
export const OfferedCourseClassScheduleRoutes = router;
