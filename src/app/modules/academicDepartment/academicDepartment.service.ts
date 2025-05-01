import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE ACADEMIC DEPARTMENT
const createAcademicDepartment = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/academic-departments', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

// UPDATE ACADEMIC DEPARTMENT
const updateAcademicDepartment = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/academic-departments/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// DELETE ACADEMIC DEPARTMENT
const deleteAcademicDepartment = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/academic-departments/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// EXPORT SERVICES
export const AcademicDepartmentServices = {
  createAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment
};
