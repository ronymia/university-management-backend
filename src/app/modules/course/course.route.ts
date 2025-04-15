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
router
  .route('/')
  .post(
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
router
  .route('/')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY
    ),
    CourseControllers.getAllCourse
  );

/**
 * GET /courses/:id
 * Retrieve a course by ID
 *
 * URL Params:
 *   id: string - The ID of the course to retrieve
 *
 * Only accessible by Super Admins and Admins
 */
router
  .route('/:id')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseControllers.getCourseById
  );

/**
 * PATCH /courses/:id
 * Update a course
 *
 * URL Params:
 *   id: string - The ID of the course to update
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
// UPDATE
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseControllers.updateCourse
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
router
  .route('/:ids')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    CourseControllers.deleteCourse
  );

/**
 * POST /courses/:id/assigned-faculties
 * Assign or remove faculties from a course
 *
 * URL Params:
 *   id: string - The ID of the course to assign or remove faculties from
 *
 * Request Body:
 *   {
 *     facultyIds: string[] - The IDs of the faculties to assign or remove
 *   }
 *
 * Only accessible by Super Admins and Admins
 */
// ASSIGN FACULTIES
router
  .route('/:id/assigned-faculties')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(CourseValidations.assignOrRemoveFacultiesSchema),
    CourseControllers.assignFaculties
  );

export const CourseRoutes = router;
