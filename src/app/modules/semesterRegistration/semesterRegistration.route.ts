import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

const router = express.Router();

/**
 * @openapi
 * /semester-registrations:
 *   post:
 *     summary: Create a new Semester Registration
 *     description: This endpoint creates a new Semester Registration.
 *     tags:
 *       - Semester Registrations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterRegistration'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(SemesterRegistrationValidation.createZodSchema),
    SemesterRegistrationController.createSemesterRegistration
  );

/**
 * @openapi
 * /semester-registrations:
 *   get:
 *     summary: Retrieve all Semester Registrations
 *     description: Retrieve all Semester Registrations.
 *     tags:
 *       - Semester Registrations
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SemesterRegistration'
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
    SemesterRegistrationController.getAllSemesterRegistration
  );

/**
 * @swagger
 * /semester-registrations/{id}:
 *   get:
 *     summary: Retrieve a single Semester Registration by ID
 *     description: Retrieve a single Semester Registration by ID.
 *     tags:
 *       - Semester Registrations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Semester Registration
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
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
    SemesterRegistrationController.getSingleSemesterRegistration
  );
/**
 * @swagger
 * /semester-registrations/{id}:
 *   patch:
 *     summary: Update a Semester Registration
 *     description: Update a Semester Registration.
 *     tags:
 *       - Semester Registrations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Semester Registration
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SemesterRegistration'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(SemesterRegistrationValidation.updateZodSchema),
    SemesterRegistrationController.updateSemesterRegistration
  );

/**
 * @openapi
 * /semester-registrations/{id}:
 *   delete:
 *     summary: Delete a Semester Registration
 *     description: Delete a Semester Registration.
 *     tags:
 *       - Semester Registrations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Semester Registration
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SemesterRegistration'
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    SemesterRegistrationController.deleteSemesterRegistration
  );

// EXPORT
export const SemesterRegistrationRoutes = router;
