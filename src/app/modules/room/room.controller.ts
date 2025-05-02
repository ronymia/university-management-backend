import { NextFunction, Request, Response } from 'express';
import { RoomServices } from './room.service';
import sendResponse from '../../../shared/response';

// CREATE ROOM
const createRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RoomServices.createRoom(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET ALL ROOM
const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RoomServices.getAllRooms(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE ROOM
const getSingleRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RoomServices.getSingleRoom(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// UPDATE ROOM
const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RoomServices.updateRoom(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// DELETE ROOM
const deleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await RoomServices.deleteRoom(req);
    sendResponse<any>(res, result);
  } catch (error) {
    next(error);
  }
};

// EXPORT CONTROLLERS
export const RoomControllers = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom
};
