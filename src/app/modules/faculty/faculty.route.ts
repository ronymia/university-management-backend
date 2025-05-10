import express from 'express';
import { FacultyControllers } from './faculty.controller';

const router = express.Router();

// router.route('/').post(FacultyControllers.createRoom);
router.route('/').get(FacultyControllers.getAllFaculties);
router.route('/:id').get(FacultyControllers.getSingleFaculty);

router
  .route('/:id')
  .patch(FacultyControllers.updateFaculty)
  .delete(FacultyControllers.deleteFaculty);

// EXPORT ROUTERS
export const FacultyRoutes = router;
