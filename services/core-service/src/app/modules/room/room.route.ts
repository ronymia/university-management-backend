import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

const router = express.Router();

// CREATE
/**
 * Create a new Room.
 *
 * @openapi
 * /rooms:
 *   post:
 *     summary: Create a new Room
 *     description: This endpoint creates a new Room.
 *     tags:
 *       - Rooms
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
router
  .route('/')
  .post(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(RoomValidation.createRoomSchema),
    RoomController.createRoom
  );

// GET SINGLE
/**
 * Get a single Room by ID
 *
 * @openapi
 * /rooms/{id}:
 *   get:
 *     summary: Get a single Room by ID
 *     description: Retrieve a single Room using its unique ID.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Room
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single Room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
router
  .route('/:id')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY
    ),
    RoomController.getSingleRoom
  );

// GET ALL
/**
 * @openapi
 * /rooms:
 *   get:
 *     summary: Get all Rooms
 *     description: Retrieve all Rooms.
 *     tags:
 *       - Rooms
 *     responses:
 *       200:
 *         description: A list of Rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */
router
  .route('/')
  .get(
    auth(
      ENUM_USER_ROLE.SUPER_ADMIN,
      ENUM_USER_ROLE.ADMIN,
      ENUM_USER_ROLE.FACULTY
    ),
    RoomController.getAllRooms
  );

// UPDATE
/**
 * @openapi
 * /rooms/{id}:
 *   patch:
 *     summary: Update a single Room
 *     description: Update details of an existing Room by its ID.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Room
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 */
router
  .route('/:id')
  .patch(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    validateRequest(RoomValidation.updateRoomZodSchema),
    RoomController.updateRoom
  );

// DELETE
/**
 * @openapi
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a Room
 *     description: Delete an existing Room by its ID.
 *     tags:
 *       - Rooms
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the Room
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Room deleted successfully
 */
router
  .route('/:id')
  .delete(
    auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
    RoomController.deleteRoom
  );

export const RoomRoutes = router;
