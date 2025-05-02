import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

const createBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/buildings', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getAllBuildings = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/buildings', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

const getSingleBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/buildings/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.Authorization
    }
  });
  return result;
};

const updateBuilding = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/buildings/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

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
