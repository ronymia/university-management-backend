import { Request } from 'express';
import { AuthService } from '../../../shared/axios';

// CREATE Management Department
const createManagementDepartment = async (req: Request): Promise<any> => {
  const result = await AuthService.post('/management-departments', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET ALL Management Department
const getAllManagementDepartments = async (req: Request): Promise<any> => {
  const result = await AuthService.get('/management-departments', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// GET SINGLE Management Department
const getSingleManagementDepartment = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/management-departments/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE Management Department
const updateManagementDepartment = async (req: Request): Promise<any> => {
  const result = await AuthService.patch(`/management-departments/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE Management Department
const deleteManagementDepartment = async (req: Request): Promise<any> => {
  const result = await AuthService.delete(`/management-departments/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const ManagementDepartmentServices = {
  createManagementDepartment,
  getAllManagementDepartments,
  getSingleManagementDepartment,
  updateManagementDepartment,
  deleteManagementDepartment
};
