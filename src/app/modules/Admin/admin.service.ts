import { Request } from 'express';
import { AuthService } from '../../../shared/axios';

// GET ALL ADMIN
const getAllAdmins = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/admins`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// GET ADMIN BU ID
const getSingleAdmin = async (req: Request): Promise<any> => {
  const result = await AuthService.get(`/admins/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};
// UPDATE ADMIN
const updateAdmin = async (req: Request): Promise<any> => {
  const result = await AuthService.patch(`/admins/${req.params.id}`, req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// DELETE ADMIN
const deleteAdmin = async (req: Request): Promise<any> => {
  const result = await AuthService.delete(`/admins/${req.params.id}`, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// EXPORT SERVICES
export const AdminServices = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin
};
