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

// GET ALL ACADEMIC SEMESTER
const getAllAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.get('/academic-semesters', {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// GET SINGLE ACADEMIC SEMESTER
const getSingleAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.get(`/academic-semesters/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// UPDATE ACADEMIC SEMESTER
const updateAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.patch(`/academic-semesters/${req.params.id}`, req.body, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// DELETE ACADEMIC SEMESTER
const deleteAcademicSemester = async (req: Request): Promise<any> => {
  const result = await HttpService.delete(`/academic-semesters/${req.params.id}`, {
    params: req.query,
    headers: {
      Authorization: req.headers.authorization
    }
  });
  return result;
};

// EXPORT DEFAULT
export const AcademicSemesterServices = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
  deleteAcademicSemester
};
