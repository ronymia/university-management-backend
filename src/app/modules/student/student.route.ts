import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.get('/', StudentController.getAllStudents);
router.route('/my-courses').get(StudentController.myCourses);

router.get('/:id', StudentController.getSingleStudent);

router.post('/', StudentController.createStudent);

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);

router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = router;
