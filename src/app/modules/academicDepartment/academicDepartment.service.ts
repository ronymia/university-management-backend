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

// EXPORT SERVICES
export const AcademicDepartmentServices = {
  createAcademicDepartment
};
