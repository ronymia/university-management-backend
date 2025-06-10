import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
const router = express.Router();

// create
/**
 * Create a new Academic Department.
 *
 * @openapi
 * /academic-departments:
 *   post:
 *     summary: Create a new Academic Department
 *     tags: [Academic Department]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the Academic Department
 *                 example: Department of Computer Science
 *               academicFacultyId:
 *                 type: string
 *                 description: The ID of the Academic Faculty
 *                 example: 1
 *     responses:
 *       201:
 *         description: The created Academic Department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created Academic Department
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the created Academic Department
 *                   example: Department of Computer Science
 *                 academicFacultyId:
 *                   type: string
 *                   description: The ID of the Academic Faculty
 *                   example: 1
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicDepartmentValidation.createZodSchema),
    AcademicDepartmentController.createAcademicDepartment
  );

/**
 * @swagger
 * /academic-departments:
 *   get:
 *     summary: Get all Academic Departments
 *     description: Returns all Academic Departments
 *     tags:
 *       - Academic Departments
 *     responses:
 *       200:
 *         description: A list of Academic Departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AcademicDepartment'
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
    AcademicDepartmentController.getAllAcademicDepartments
  );

// GET BY ID
/**
 * @swagger
 * /academic-departments/{id}:
 *   get:
 *     summary: Get a single Academic Department by ID
 *     description: Retrieve a single Academic Department using its unique ID.
 *     tags:
 *       - Academic Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Academic Department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicDepartment'
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
    AcademicDepartmentController.getSingleAcademicDepartment
  );

// UPDATE
/**
 * @swagger
 * /academic-departments/{id}:
 *   patch:
 *     summary: Update an Academic Department
 *     description: Update details of an existing Academic Department by its ID.
 *     tags:
 *       - Academic Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Department
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcademicDepartment'
 *     responses:
 *       200:
 *         description: Academic Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcademicDepartment'
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(AcademicDepartmentValidation.updateZodSchema),
    AcademicDepartmentController.updateAcademicDepartment
  );

// DELETE
/**
 * Delete an Academic Department by its ID.
 *
 * @openapi
 * /academic-departments/{id}:
 *   delete:
 *     summary: Delete an Academic Department
 *     description: Delete an existing Academic Department by its ID.
 *     tags:
 *       - Academic Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Academic Department
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Academic Department deleted successfully
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    AcademicDepartmentController.deleteAcademicDepartment
  );

export const AcademicDepartmentRoutes = router;
