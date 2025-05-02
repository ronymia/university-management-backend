import express from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

router.post('/get-my-registration', SemesterRegistrationControllers.getMyRegistration);
router.route('/').get(SemesterRegistrationControllers.getAllSemesterRegistration);
router.route('/:id').get(SemesterRegistrationControllers.getSingleSemesterRegistration);

router.post(
  '/enrolled-into-semester',
  SemesterRegistrationControllers.enrollIntoSemesterRegistration
);
router.post('/enrolled-into-course', SemesterRegistrationControllers.enrolledIntoCourse);
router.post(
  '/withdraw-from-enrolled-course',
  SemesterRegistrationControllers.withdrawFromEnrolledCourse
);

router.route('/:id/start-new-semester').post(SemesterRegistrationControllers.startNewSemester);

router.route('/').post(SemesterRegistrationControllers.createSemesterRegistration);

router
  .route('/confirm-my-registration')
  .patch(SemesterRegistrationControllers.confirmMyRegistration);

router
  .route('/:id')
  .patch(SemesterRegistrationControllers.updateSemesterRegistration)
  .delete(SemesterRegistrationControllers.deleteSemesterRegistration);

// EXPORT ROUTERS
export const SemesterRegistrationRoutes = router;
