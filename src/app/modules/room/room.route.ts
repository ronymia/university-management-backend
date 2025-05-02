import express from 'express';
import { RoomControllers } from './room.controller';

const router = express.Router();

router.route('/').get(RoomControllers.getAllRooms);
router.route('/:id').get(RoomControllers.getSingleRoom);

router.route('/').post(RoomControllers.createRoom);

router.route('/:id').patch(RoomControllers.updateRoom).delete(RoomControllers.deleteRoom);

// EXPORT ROUTERS
export const RoomRoutes = router;
