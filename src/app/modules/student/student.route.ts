import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.getAllStudents
);
router
  .route('/my-courses')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
    StudentController.myCourses
  );
router
  .route('/my-semester-reg-courses')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
    StudentController.mySemesterRegCourses
  );
router
  .route('/my-course-schedules')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
    StudentController.myCourseSchedules
  );

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.getSingleStudent
);

router.post(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.createStudent
);

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.updateStudent
);

router.delete(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.deleteStudent
);

export const StudentRoutes = router;
