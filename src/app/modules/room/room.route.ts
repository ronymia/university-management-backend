import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

const router = express.Router();

router.post(
  '/',
  //   auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(RoomValidation.createRoomSchema),
  RoomController.createRoom
);

router.get('/:id', RoomController.getSingleRoom);
router.get('/', RoomController.getAllRooms);

router.patch(
  '/:id',
  validateRequest(RoomValidation.updateRoomZodSchema),
  RoomController.updateRoom
);
router.delete('/:id', RoomController.deleteRoom);

export const RoomRoutes = router;
