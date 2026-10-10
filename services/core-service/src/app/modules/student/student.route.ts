import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// ========== Student-Specific Routes ==========
router.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  StudentController.myCourses
);

router.get(
  '/my-semester-reg-courses',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  StudentController.mySemesterRegCourses
);

router.get(
  '/my-course-schedules',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  StudentController.myCourseSchedules
);

router.get(
  '/my-academic-info',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.STUDENT),
  StudentController.myAcademicInfo
);

// ========== Generic CRUD Routes ==========
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.getAllStudents
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

router.get(
  '/:id',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.ADMIN
  ),
  StudentController.getSingleStudent
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
