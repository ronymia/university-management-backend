import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';

const router = express.Router();

/**
 * POST /courses
 * Create a new course
 *
 * Request Body:
 *   {
 *     title: string,
 *     code: string,
 *     credits: number,
 *     preRequisiteCourses: [{ courseId: string }]
 *   }
 *
 * Only accessible by Super Admins and Admins
 */
router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(CourseValidations.createSchema),
  CourseControllers.createCourse
);

export const CourseRoutes = router;
