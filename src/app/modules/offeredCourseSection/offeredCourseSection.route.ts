import express from 'express';
import { OfferedCourseSectionControllers } from './offeredCourseSection.controller';

const router = express.Router();

router.route('/').get(OfferedCourseSectionControllers.getAllOfferedCourseSections);
router.route('/:id').get(OfferedCourseSectionControllers.getSingleOfferedCourseSection);

router.route('/').post(OfferedCourseSectionControllers.createOfferedCourseSection);

router
  .route('/:id')
  .patch(OfferedCourseSectionControllers.updateOfferedCourseSection)
  .delete(OfferedCourseSectionControllers.deleteOfferedCourseSection);

// EXPORT ROUTERS
export const OfferedCourseSectionRoutes = router;
