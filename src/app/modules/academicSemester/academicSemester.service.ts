import { Request } from 'express';
import { CoreService as HttpService } from '../../../shared/axios';

// CREATE ACADEMIC SEMESTER
const createAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.post('/academic-semesters', req.body, {
    headers: {
      Authorization: req.headers.authorization
    }
  });

  // RETURN
  return result;
};

const getAllAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/academic-semesters', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

const getSingleAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/academic-semesters/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.Authorization
    }
  });
  return result;
};

// EXPORT DEFAULT
export const AcademicSemesterServices = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester
};
