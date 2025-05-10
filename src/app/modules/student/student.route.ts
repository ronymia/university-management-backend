import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

// router.route('/').post(StudentControllers.createRoom);
router.route('/').get(StudentControllers.getAllStudents);
router.route('/:id').get(StudentControllers.getSingleStudent);

router
  .route('/:id')
  .patch(StudentControllers.updateStudent)
  .delete(StudentControllers.deleteStudent);

// EXPORT ROUTERS
export const StudentRoutes = router;
