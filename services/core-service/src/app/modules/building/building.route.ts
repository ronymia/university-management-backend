import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidation } from './building.validation';
const router = express.Router();
/**
 * Create a new Building.
 *
 * @openapi
 * /buildings:
 *   post:
 *     summary: Create a new Building
 *     description: This endpoint creates a new Building.
 *     tags:
 *       - Buildings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Building'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 */
// CREATE
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(BuildingValidation.createBuildingZodSchema),
    BuildingController.createBuilding
  );

/**
 * Get a single Building by ID.
 *
 * @openapi
 * /buildings/{id}:
 *   get:
 *     summary: Get a single Building by ID
 *     description: Retrieve a single Building using its unique ID.
 *     tags:
 *       - Buildings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Building
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Building
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 */
// GET BY ID
router
  .route('/:id')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BuildingController.getSingleBuilding
  );

/**
 * Get all Buildings.
 *
 * @openapi
 * /buildings:
 *   get:
 *     summary: Get all Buildings
 *     description: Retrieve all Buildings.
 *     tags:
 *       - Buildings
 *     responses:
 *       200:
 *         description: A list of Buildings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Building'
 */
// GET ALL
router
  .route('/')
  .get(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BuildingController.getAllBuildings
  );

/**
 * Update an existing Building.
 *
 * @openapi
 * /buildings/{id}:
 *   patch:
 *     summary: Update an existing Building
 *     description: Update details of an existing Building by its ID.
 *     tags:
 *       - Buildings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Building
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Building'
 *     responses:
 *       200:
 *         description: Building updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Building'
 */
// UPDATE
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(BuildingValidation.updateBuildingZodSchema),
    BuildingController.updateBuilding
  );

/**
 * Delete an existing Building.
 *
 * @openapi
 * /buildings/{id}:
 *   delete:
 *     summary: Delete an existing Building
 *     description: Delete an existing Building by its ID.
 *     tags:
 *       - Buildings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Building
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Building deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Building deleted successfully
 */

// DELETE
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    BuildingController.deleteBuilding
  );

export const BuildingRoutes = router;
