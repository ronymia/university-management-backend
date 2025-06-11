import express from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

// const router = express.Router();

// GET specific and unique routes first
router.get('/get-my-registration', SemesterRegistrationControllers.getMyRegistration);
router.get('/get-my-semester-courses', SemesterRegistrationControllers.getMySemesterRegCourses);

// POST specific routes
router.post('/start-registration', SemesterRegistrationControllers.startMyRegistration);
router.post(
  '/enrolled-into-semester',
  SemesterRegistrationControllers.enrollIntoSemesterRegistration
);
router.post('/enrolled-into-course', SemesterRegistrationControllers.enrolledIntoCourse);
router.post(
  '/withdraw-from-enrolled-course',
  SemesterRegistrationControllers.withdrawFromEnrolledCourse
);

// POST confirm registration
router.post('/confirm-my-registration', SemesterRegistrationControllers.confirmMyRegistration);

// Specific route must come BEFORE generic ':id'
router.post('/:id/start-new-semester', SemesterRegistrationControllers.startNewSemester);

// Generic CRUD
router
  .route('/')
  .get(SemesterRegistrationControllers.getAllSemesterRegistration)
  .post(SemesterRegistrationControllers.createSemesterRegistration);

router
  .route('/:id')
  .get(SemesterRegistrationControllers.getSingleSemesterRegistration)
  .patch(SemesterRegistrationControllers.updateSemesterRegistration)
  .delete(SemesterRegistrationControllers.deleteSemesterRegistration);

// EXPORT ROUTERS
export const SemesterRegistrationRoutes = router;
