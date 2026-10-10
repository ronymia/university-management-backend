import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionControllers } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';
const router = express.Router();

/**
 * @openapi
 * /offered-course-sections:
 *   post:
 *     summary: Create a new Offered Course Section
 *     description: This endpoint creates a new Offered Course Section.
 *     tags:
 *       - Offered Course Sections
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferedCourseSection'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseSection'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(
      OfferedCourseSectionValidation.createOfferedCourseSectionZodValidation
    ),
    OfferedCourseSectionControllers.createOfferedCourseSection
  );

/**
 * @openapi
 * /offered-course-sections/{id}:
 *   get:
 *     summary: Get a single Offered Course Section
 *     description: This endpoint retrieves a single Offered Course Section by its ID.
 *     tags:
 *       - Offered Course Sections
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Offered Course Section
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferedCourseSection'
 */
/**
 * Get a single Offered Course Section
 * @param {string} id - The unique ID of the Offered Course Section
 * @returns {Promise<OfferedCourseSection>} - The Offered Course Section
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
    OfferedCourseSectionControllers.getSingleOfferedCourseSection
  );

/**
 * @openapi
 * /offered-course-sections:
 *   get:
 *     summary: Get all Offered Course Sections
 *     description: This endpoint retrieves all Offered Course Sections.
 *     tags:
 *       - Offered Course Sections
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OfferedCourseSection'
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
    OfferedCourseSectionControllers.getAllOfferedCourseSections
  );

/**
 * Update an Offered Course Section
 * @param {string} id - The unique ID of the Offered Course Section
 * @param {OfferedCourseSection} payload - The updated Offered Course Section
 * @returns {Promise<OfferedCourseSection>} - The updated Offered Course Section
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(
      OfferedCourseSectionValidation.createOfferedCourseSectionZodValidation
    ),
    OfferedCourseSectionControllers.updateOfferedCourseSection
  );

/**
 * Delete an Offered Course Section
 * @param {string} id - The unique ID of the Offered Course Section
 * @returns {Promise<void>} - Promise that resolves when the Offered Course Section is deleted
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    OfferedCourseSectionControllers.deleteOfferedCourseSection
  );

//   EXPORT
export const OfferedCourseSectionRoutes = router;
