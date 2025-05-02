import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE ROOM
const createRoom = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/rooms', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL ROOM
const getAllRooms = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/rooms', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET SINGLE ROOM
const getSingleRoom = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/rooms/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE ROOM
const updateRoom = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/rooms/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE ROOM
const deleteRoom = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/rooms/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const RoomServices = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom
};
