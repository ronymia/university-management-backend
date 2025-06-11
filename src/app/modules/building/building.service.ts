import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE BUILDING
const createBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/buildings', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL BUILDING
const getAllBuildings = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/buildings', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET SINGLE BUILDING
const getSingleBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/buildings/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// UPDATE BUILDING
const updateBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/buildings/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// DELETE BUILDING
const deleteBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/buildings/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// EXPORT SERVICES
export const BuildingServices = {
  createBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateBuilding,
  deleteBuilding
};
