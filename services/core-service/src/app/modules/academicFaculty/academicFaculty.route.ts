import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
const router = express.Router();

// CREATE
/**
 * Create a new Academic Faculty.
 *
 * @openapi
 * /academic-faculties:
 *   post:
 *     summary: Create a new Academic Faculty
 *     description: This endpoint creates a new Academic Faculty.
 *     tags:
 *       - Academic Faculties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicFaculty'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicFaculty'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicFacultyValidation.createAcademicFacultyZodSchema),
    AcademicFacultyController.createAcademicFaculty
  );

// GET ALL
/**
 * @swagger
 * /academic-faculties:
 *   get:
 *     summary: Get all Academic Faculties
 *     description: Returns all Academic Faculties
 *     tags:
 *       - Academic Faculties
 *     responses:
 *       200:
 *         description: A list of Academic Faculties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicFaculty'
 */
router
  .route('/')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY
    ),
    AcademicFacultyController.getAllAcademicFaculties
  );

// GET BY ID
/**
 * @swagger
 * /academic-faculties/{id}:
 *   get:
 *     summary: Get a single Academic Faculty by ID
 *     description: Retrieve a single Academic Faculty using its unique ID.
 *     tags:
 *       - Academic Faculties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Faculty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Academic Faculty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicFaculty'
 */
router
  .route('/:id')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY
    ),
    AcademicFacultyController.getSingleAcademicFaculty
  );

// UPDATE
/**
 * @swagger
 * /academic-faculties/{id}:
 *   patch:
 *     summary: Update an Academic Faculty
 *     description: Update details of an existing Academic Faculty by its ID.
 *     tags:
 *       - Academic Faculties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Faculty
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicFaculty'
 *     responses:
 *       200:
 *         description: Academic Faculty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicFaculty'
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicFacultyValidation.updateAcademicFacultyZodSchema),
    AcademicFacultyController.updateAcademicFaculty
  );

// DELETE
/**
 * Deletes an Academic Faculty by its ID.
 *
 * @param {string} id - The unique ID of the Academic Faculty
 * @returns {Promise<void>}
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicFacultyController.deleteAcademicFaculty
  );

export const AcademicFacultyRoutes = router;
