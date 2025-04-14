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

/**
 * GET /courses
 * Retrieve all courses
 *
 * Query Params:
 *   searchTerm: string - Search term to filter courses
 *   id: string - Filter courses by ID
 *   code: string - Filter courses by code
 *   name: string - Filter courses by name
 *   limit: number - Limit the number of courses returned
 *   page: number - Page number for pagination
 *
 * Only accessible by Super Admins and Admins
 */
router.get('/', CourseControllers.getAllCourse);

/**
 * GET /courses/:id
 * Retrieve a course by ID
 *
 * URL Params:
 *   id: string - The ID of the course to retrieve
 *
 * Only accessible by Super Admins and Admins
 */
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseControllers.getCourseById
);

/**
 * DELETE /courses/:ids
 * Delete courses by IDs
 *
 * URL Params:
 *   ids: string - The IDs of the courses to delete, separated by commas
 *
 * Only accessible by Super Admins and Admins
 */
router.delete(
  '/:ids',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  CourseControllers.deleteCourse
);

export const CourseRoutes = router;
