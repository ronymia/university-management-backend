import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';

const router = express.Router();

/**
 * @openapi
 * /offered-courses:
 *   post:
 *     summary: Create a new Offered Course
 *     description: This endpoint creates a new Offered Course.
 *     tags:
 *       - Offered Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferedCourse'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourse'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(OfferedCourseValidation.createOfferedCourseZodSchema),
    OfferedCourseController.createOfferedCourse
  );
/**
 * @openapi
 * /offered-courses/{id}:
 *   get:
 *     summary: Get a single Offered Course
 *     description: This endpoint retrieves a single Offered Course by its ID.
 *     tags:
 *       - Offered Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourse'
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
    OfferedCourseController.getSingleOfferedCourse
  );
/**
 * @openapi
 * /offered-courses:
 *   get:
 *     summary: Retrieve all Offered Courses
 *     description: Returns a list of all Offered Courses.
 *     tags:
 *       - Offered Courses
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         required: false
 *         description: Search term to filter offered courses
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: false
 *         description: Filter offered courses by ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: courseId
 *         required: false
 *         description: Filter offered courses by Course ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: semesterRegistrationId
 *         required: false
 *         description: Filter offered courses by Semester Registration ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Limit the number of offered courses returned
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of offered courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OfferedCourse'
 */
router
  .route('/')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY,
      ENUM_USER_ROLE.STUDENT
    ),
    OfferedCourseController.getAllOfferedCourses
  );

/**
 * @openapi
 * /offered-courses/{id}:
 *   patch:
 *     summary: Update an Offered Course
 *     description: This endpoint updates an existing Offered Course by its ID.
 *     tags:
 *       - Offered Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferedCourse'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourse'
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(OfferedCourseValidation.updateOfferedCourseZodSchema),
    OfferedCourseController.updateOfferedCourse
  );

/**
 * @openapi
 * /offered-courses/{id}:
 *   delete:
 *     summary: Delete an Offered Course
 *     description: This endpoint deletes an existing Offered Course by its ID.
 *     tags:
 *       - Offered Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourse'
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseController.deleteOfferedCourse
  );

export const OfferedCourseRoutes = router;
