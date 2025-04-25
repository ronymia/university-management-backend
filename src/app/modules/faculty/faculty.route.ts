import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

/**
 * GET /faculties
 * Retrieve all Faculties
 *
 * @returns {Promise<void>}
 */
router
  .route('/')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.getAllFaculties
  );

router
  .route('/my-courses')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.myCourses
  );

/**
 * GET /faculties/:id
 * Retrieve a single Faculty by ID
 *
 * @param {string} id - The ID of the Faculty to retrieve
 *
 * @returns {Promise<void>}
 */
router
  .route('/:id')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY,
      ENUM_USER_ROLE.STUDENT
    ),
    FacultyController.getSingleFaculty
  );

/**
 * @swagger
 * /faculties:
 *   post:
 *     summary: Create a new Faculty
 *     description: This endpoint creates a new Faculty.
 *     tags:
 *       - Faculties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Faculty'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Faculty'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(FacultyValidation.updateFacultyZodSchema),
    FacultyController.createFaculty
  );

/**
 * PATCH /faculties/:id
 * Update a single Faculty by ID
 *
 * @param {string} id - The ID of the Faculty to update
 *
 * @returns {Promise<void>}
 */
router
  .route('/:id')
  .patch(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY
    ),
    validateRequest(FacultyValidation.updateFacultyZodSchema),
    FacultyController.updateFaculty
  );

/**
 * DELETE /faculties/:id
 * Delete a single Faculty by ID
 *
 * @param {string} id - The ID of the Faculty to delete
 *
 * @returns {Promise<void>}
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    FacultyController.deleteFaculty
  );

/**
 * POST /faculties/:id/assigned-courses
 * Assign courses to a Faculty
 *
 * @param {string} id - The ID of the Faculty to assign courses to
 *
 * @param {string[]} courseIds - The IDs of the courses to assign
 *
 * @returns {Promise<void>}
 */
router
  .route('/:id/assigned-courses')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(FacultyValidation.assignOrRemoveCoursesSchema),
    FacultyController.assignCourses
  );
/**
 * DELETE /faculties/:id/remove-courses
 * Remove courses from a Faculty
 *
 * @param {string} id - The ID of the Faculty to remove courses from
 *
 * @param {string[]} courseIds - The IDs of the courses to remove
 *
 * @returns {Promise<void>}
 */
router
  .route('/:id/remove-courses')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(FacultyValidation.assignOrRemoveCoursesSchema),
    FacultyController.removeCourses
  );

export const FacultyRoutes = router;
