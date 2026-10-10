import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleControllers } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';
const router = express.Router();

/**
 * @openapi
 * /offered-course-ClassSchedules:
 *   post:
 *     summary: Create a new Offered Course ClassSchedule
 *     description: This endpoint creates a new Offered Course ClassSchedule.
 *     tags:
 *       - Offered Course ClassSchedules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferedCourseClassSchedule'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseClassSchedule'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(
      OfferedCourseClassScheduleValidation.createOfferedCourseClassScheduleZodValidation
    ),
    OfferedCourseClassScheduleControllers.createOfferedCourseClassSchedule
  );

/**
 * @openapi
 * /offered-course-ClassSchedules/{id}:
 *   get:
 *     summary: Get a single Offered Course ClassSchedule
 *     description: This endpoint retrieves a single Offered Course ClassSchedule by its ID.
 *     tags:
 *       - Offered Course ClassSchedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course ClassSchedule
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseClassSchedule'
 */
/**
 * Get a single Offered Course ClassSchedule
 * @param {string} id - The unique ID of the Offered Course ClassSchedule
 * @returns {Promise<OfferedCourseClassSchedule>} - The Offered Course ClassSchedule
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
    OfferedCourseClassScheduleControllers.getSingleOfferedCourseClassSchedule
  );

/**
 * @openapi
 * /offered-course-ClassSchedules:
 *   get:
 *     summary: Get all Offered Course ClassSchedules
 *     description: This endpoint retrieves all Offered Course ClassSchedules.
 *     tags:
 *       - Offered Course ClassSchedules
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OfferedCourseClassSchedule'
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
    OfferedCourseClassScheduleControllers.getAllOfferedCourseClassSchedules
  );

/**
 * Update an Offered Course ClassSchedule
 * @param {string} id - The unique ID of the Offered Course ClassSchedule
 * @param {OfferedCourseClassSchedule} payload - The updated Offered Course ClassSchedule
 * @returns {Promise<OfferedCourseClassSchedule>} - The updated Offered Course ClassSchedule
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(
      OfferedCourseClassScheduleValidation.updateOfferedCourseClassScheduleZodValidation
    ),
    OfferedCourseClassScheduleControllers.updateOfferedCourseClassSchedule
  );

/**
 * Delete an Offered Course ClassSchedule
 * @param {string} id - The unique ID of the Offered Course ClassSchedule
 * @returns {Promise<void>} - Promise that resolves when the Offered Course ClassSchedule is deleted
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseClassScheduleControllers.deleteOfferedCourseClassSchedule
  );

//   EXPORT
export const OfferedCourseClassScheduleRoutes = router;
